package be.pxl.microservices.api.controller;

import be.pxl.microservices.api.dto.request.RemarkRequest;
import be.pxl.microservices.client.PostClient;
import be.pxl.microservices.api.dto.response.PostResponse;
import be.pxl.microservices.domain.PostState;
import be.pxl.microservices.domain.Remark;
import be.pxl.microservices.repository.RemarkRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class RemarkTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RemarkRepository remarkRepository;

    @MockBean
    private PostClient postClient;

    @MockBean
    private RabbitTemplate rabbitTemplate;

    @Container
    private static final MySQLContainer sglContainer = new MySQLContainer(
            "mysql:5.7.37"
    );

    @DynamicPropertySource
    static void registerMySqlProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sglContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sglContainer::getUsername);
        registry.add("spring.datasource.password", sglContainer::getPassword);
        registry.add("spring.datasource.driver-class-name", sglContainer::getDriverClassName);
    }

    @AfterEach
    public void afterEachTest() {
        remarkRepository.deleteAll();
    }

    @Test
    public void testGetReviewPosts() throws Exception {
        List<PostResponse> mockPosts = List.of(
                PostResponse.builder()
                        .id(1L)
                        .title("Review Post 1")
                        .content("Content for review post 1")
                        .state(PostState.SUBMITTED)
                        .author("Author 1")
                        .authorId(1)
                        .build(),
                PostResponse.builder()
                        .id(2L)
                        .title("Review Post 2")
                        .content("Content for review post 2")
                        .state(PostState.SUBMITTED)
                        .author("Author 2")
                        .authorId(2)
                        .build()
        );

        when(postClient.getReviewPosts()).thenReturn(mockPosts);

        mockMvc.perform(MockMvcRequestBuilders.get("/posts")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].title").value("Review Post 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].content").value("Content for review post 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].state").value("SUBMITTED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].author").value("Author 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].authorId").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(2L))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].title").value("Review Post 2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].content").value("Content for review post 2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].state").value("SUBMITTED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].author").value("Author 2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].authorId").value(2));


        verify(postClient, times(1)).getReviewPosts();
    }

    @Test
    public void testApprovePost() throws Exception {
        Long postId = 1L;

        mockMvc.perform(MockMvcRequestBuilders.post("/posts/{id}/approve", postId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(rabbitTemplate, times(1)).convertAndSend("approvePostQueue", postId);
    }

    @Test
    public void testRejectPost_withRemark() throws Exception {

        RemarkRequest remarkRequest = RemarkRequest.builder()
                .content("This post is inappropriate.")
                .postId(1L)
                .build();

        String remarkRequestJson = objectMapper.writeValueAsString(remarkRequest);


        mockMvc.perform(MockMvcRequestBuilders.post("/posts/{postId}/reject", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(remarkRequestJson)
                        .header("username", "testUser")
                        .header("id", 1001))
                .andExpect(status().isOk());


        Optional<Remark> savedRemark = remarkRepository.findAll().stream()
                .filter(remark -> remark.getContent().equals("This post is inappropriate."))
                .findFirst();

        assertTrue(savedRemark.isPresent(), "Remark should be saved in the repository.");
    }

    @Test
    public void testRejectPost_withoutRemark() throws Exception {

        RemarkRequest remarkRequest = RemarkRequest.builder()
                .content("")
                .postId(1L)
                .build();

        String remarkRequestJson = objectMapper.writeValueAsString(remarkRequest);

        long initialRemarkCount = remarkRepository.count();

        mockMvc.perform(MockMvcRequestBuilders.post("/posts/{postId}/reject", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(remarkRequestJson)
                        .header("username", "testUser")
                        .header("id", 1001))
                .andExpect(status().isOk());


        long finalRemarkCount = remarkRepository.count();
        assertEquals(initialRemarkCount, finalRemarkCount, "No new remark should be added to the repository.");
    }

    @Test
    public void testGetRemarksByPostId() throws Exception {
        Long postId = 1L;
        Remark remark1 = Remark.builder()
                .content("Remark 1 content")
                .postId(postId)
                .reviewer("Reviewer 1")
                .reviewerId(101)
                .creationDate(LocalDateTime.now())
                .build();
        Remark remark2 = Remark.builder()
                .content("Remark 2 content")
                .postId(postId)
                .reviewer("Reviewer 2")
                .reviewerId(102)
                .creationDate(LocalDateTime.now())
                .build();

        remarkRepository.saveAll(List.of(remark1, remark2));


        mockMvc.perform(MockMvcRequestBuilders.get("/posts/{postId}/remarks", postId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].content").value("Remark 1 content"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].reviewer").value("Reviewer 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].reviewerId").value(101))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].content").value("Remark 2 content"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].reviewer").value("Reviewer 2"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].reviewerId").value(102));

    }
}


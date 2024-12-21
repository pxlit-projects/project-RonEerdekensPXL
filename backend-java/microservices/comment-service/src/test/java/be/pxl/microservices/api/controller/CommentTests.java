package be.pxl.microservices.api.controller;

import be.pxl.microservices.api.dto.request.CommentRequest;
import be.pxl.microservices.domain.Comment;
import be.pxl.microservices.repository.CommentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class CommentTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

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
        commentRepository.deleteAll();
    }



    @Test
    public void testCreateComment() throws Exception {
        CommentRequest commentRequest = CommentRequest.builder()
                .comment("This is a comment")
                .postId(1L)
                .build();

        String commentRequestJson = objectMapper.writeValueAsString(commentRequest);
        mockMvc.perform(MockMvcRequestBuilders.post("/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(commentRequestJson)
                .header("username", "Author 1")
                .header("id", 1)
                .header("email", "author@example.com"))
                .andExpect(status().isCreated());

        assertEquals(1, commentRepository.findAll().size());
    }

    @Test
    void testGetAllCommentsByUser() throws Exception {
        Comment comment1 = Comment.builder()
                .author("Author 1")
                .authorId(1)
                .comment("First comment")
                .creationDate(LocalDateTime.now())
                .postId(1L)
                .build();

        Comment comment2 = Comment.builder()
                .author("Author 1")
                .authorId(1)
                .comment("Second comment")
                .creationDate(LocalDateTime.now())
                .postId(1L)
                .build();

        commentRepository.save(comment1);
        commentRepository.save(comment2);


        mockMvc.perform(MockMvcRequestBuilders.get("/")
                        .header("username", "Author 1")
                        .header("id", 1)
                        .header("email", "author@example.com"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2)) // Ensure two comments are returned
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].comment").value("First comment"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].comment").value("Second comment"));
    }

    @Test
    void testGetCommentsByPostId() throws Exception {

        Comment comment1 = Comment.builder()
                .author("Author 1")
                .authorId(1)
                .comment("First comment")
                .creationDate(LocalDateTime.now())
                .postId(1L)
                .build();

        Comment comment2 = Comment.builder()
                .author("Author 1")
                .authorId(1)
                .comment("Second comment")
                .creationDate(LocalDateTime.now())
                .postId(1L)
                .build();


        commentRepository.save(comment1);
        commentRepository.save(comment2);


        mockMvc.perform(MockMvcRequestBuilders.get("/post/{postId}", 1L)
                        .header("username", "Author 1")
                        .header("id", 1))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].comment").value("First comment"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].comment").value("Second comment"));
    }

    @Test
    void testDeleteComment() throws Exception {
        Comment comment = Comment.builder()
                .author("Author 1")
                .authorId(1)
                .comment("Comment to be deleted")
                .creationDate(LocalDateTime.now())
                .postId(1L)
                .build();

        Comment savedComment = commentRepository.save(comment);


        mockMvc.perform(MockMvcRequestBuilders.delete("/{commentId}", savedComment.getId())
                        .header("username", "Author 1")
                        .header("id", 1))
                .andExpect(status().isNoContent());


        assertEquals(0, commentRepository.count());
    }
    @Test
    void testUpdateComment() throws Exception {
        Comment comment = Comment.builder()
                .author("Author 1")
                .authorId(1)
                .comment("Old comment")
                .creationDate(LocalDateTime.now())
                .postId(1L)
                .build();

        Comment savedComment = commentRepository.save(comment);

        CommentRequest commentRequest = CommentRequest.builder()
                .comment("Updated comment")
                .postId(1L)
                .build();



        mockMvc.perform(MockMvcRequestBuilders.put("/{commentId}", savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest))
                        .header("username", "Author 1")
                        .header("id", 1))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.comment").value("Updated comment"));


        Comment updatedComment = commentRepository.findById(comment.getId()).orElseThrow();
        assertEquals("Updated comment", updatedComment.getComment());
    }

    @Test
    void testUpdateCommentUnauthorized() throws Exception {
        // Arrange: Create and save a comment with authorId = 1
        Comment comment = Comment.builder()
                .author("Author 1")
                .authorId(1)
                .comment("Old comment")
                .creationDate(LocalDateTime.now())
                .postId(1L)
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Prepare the CommentRequest for updating the comment
        CommentRequest commentRequest = CommentRequest.builder()
                .comment("Updated comment")
                .postId(1L)
                .build();

        // Act & Assert: Try to update the comment with a different user (wrong username or id)
        mockMvc.perform(MockMvcRequestBuilders.put("/{commentId}", savedComment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest))
                        .header("username", "Author 2")  // Wrong username
                        .header("id", 2))  // Wrong id
                .andExpect(status().isBadRequest())  // Expect HTTP 400 Bad Request due to IllegalArgumentException
                .andExpect(MockMvcResultMatchers.content().string("You are not the author of this comment"));
    }
}

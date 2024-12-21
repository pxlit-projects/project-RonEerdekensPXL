package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.PostResponse;
import be.pxl.microservices.client.PostClient;
import be.pxl.microservices.domain.Remark;
import be.pxl.microservices.repository.RemarkRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class ReviewServiceTests {
    @Mock
    private RemarkRepository remarkRepository;

    @Mock
    private PostClient postClient;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private ReviewService reviewService;

    @BeforeEach
    public void setUp() {

        assertNotNull(rabbitTemplate, "RabbitTemplate mock is not injected");  // Check if the mock is injected
        assertNotNull(remarkRepository, "RemarkRepository mock is not injected");
        assertNotNull(postClient, "PostClient mock is not injected");
    }

    @Test
    public void getReviewPosts_ShouldReturnPosts() {


        PostResponse postResponse1 = PostResponse.builder().id(1L).title("Post 1").content("Content 1").build();
        PostResponse postResponse2 = PostResponse.builder().id(2L).title("Post 2").content("Content 2").build();
        List<PostResponse> postResponses = new ArrayList<>();
        postResponses.add(postResponse1);
        postResponses.add(postResponse2);


        when(postClient.getReviewPosts()).thenReturn(postResponses);


        List<PostResponse> result = reviewService.getReviewPosts();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(postClient, times(1)).getReviewPosts();
    }

    @Test
    public void approvePost_ShouldSendMessageToQueue() {

        Long postId = 1L;
        //doNothing().when(rabbitTemplate).convertAndSend("approvePostQueue", postId);
        reviewService.approvePost(postId);

        verify(rabbitTemplate, times(1)).convertAndSend("approvePostQueue", postId);
    }



    @Test
    public void rejectPost_ShouldSendMessageAndSaveRemark() {

        Long postId = 1L;
        String username = "user1";
        int reviewerId = 100;
        Remark remark = Remark.builder().content("Not good").postId(postId).build();

        //doNothing().when(rabbitTemplate).convertAndSend("rejectPostQueue", postId);
        reviewService.rejectPost(postId, username, reviewerId, remark);


        verify(rabbitTemplate, times(1)).convertAndSend("rejectPostQueue", postId);
        verify(remarkRepository, times(1)).save(remark);
        assertEquals(username, remark.getReviewer());
        assertEquals(reviewerId, remark.getReviewerId());
        assertNotNull(remark.getCreationDate());
    }

    @Test
    public void rejectPost_ShouldNotSaveRemark_WhenContentIsEmpty() {
        Long postId = 1L;
        String username = "user1";
        int reviewerId = 100;
        Remark remark = Remark.builder().content("").postId(postId).build();

        reviewService.rejectPost(postId, username, reviewerId, remark);

        verify(rabbitTemplate, times(1)).convertAndSend("rejectPostQueue", postId);
        verify(remarkRepository, times(0)).save(any(Remark.class));
    }


    @Test
    public void getRemarksByPostId_ShouldReturnRemarks() {

        Long postId = 1L;
        Remark remark1 = Remark.builder().postId(postId).reviewer("user1").reviewerId(1)
                .content("test").creationDate(LocalDateTime.now()).id(1L).build();
        Remark remark2 = Remark.builder().postId(postId).reviewer("user1").reviewerId(1)
                .content("test2").creationDate(LocalDateTime.now()).id(2L).build();

        List<Remark> remarks = new ArrayList<>();
        remarks.add(remark1);
        remarks.add(remark2);


        when(remarkRepository.findAllByPostId(postId)).thenReturn(remarks);


        List<Remark> result = reviewService.getRemarksByPostId(postId);


        assertNotNull(result);
        assertEquals(2, result.size());

    }
}
package be.pxl.microservices.services;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import be.pxl.microservices.exception.PostNotFoundException;
import be.pxl.microservices.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.logging.Logger;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QueueServiceTests {
    @Mock
    private PostRepository postRepository;
    @Mock
    private MailSenderService mailSenderService;

    @InjectMocks
    private QueueService queueService;

    private Post post;

    @BeforeEach
    public void setUp() {
        post = Post.builder()
                .id(1L)
                .title("Sample Post")
                .content("This is a sample post.")
                .author("user1")
                .authorId(100)
                .state(PostState.SUBMITTED)
                .email("user1@example.com")
                .build();
    }

    @Test
    public void approvePost_ShouldApprovePostAndSendEmail() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // Act
        queueService.approvePost(1L);

        // Assert
        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).save(post);
        verify(mailSenderService, times(1)).sendNewMail(
                eq(post.getEmail()),
                eq("Post approved with title: 'Sample Post'"),
                eq("Your post 'Sample Post' has been approved")
        );

        assertEquals(PostState.APPROVED, post.getState());

    }

    @Test
    public void approvePost_ShouldThrowException_WhenPostNotFound() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PostNotFoundException.class, () -> queueService.approvePost(1L));

        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, never()).save(any(Post.class));
        verify(mailSenderService, never()).sendNewMail(anyString(), anyString(), anyString());
    }

    @Test
    public void rejectPost_ShouldRejectPostAndSendEmail() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // Act
        queueService.rejectPost(1L);

        // Assert
        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).save(post);
        verify(mailSenderService, times(1)).sendNewMail(
                eq(post.getEmail()),
                eq("Post rejected with title Sample Post"),
                eq("Your post 'Sample Post' has been rejected\nPlease check the remarks in the review service")
        );
        assertEquals(PostState.REJECTED, post.getState());

    }

    @Test
    public void rejectPost_ShouldThrowException_WhenPostNotFound() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PostNotFoundException.class, () -> queueService.rejectPost(1L));

        verify(postRepository, times(1)).findById(1L);
        verify(postRepository, never()).save(any(Post.class));
        verify(mailSenderService, never()).sendNewMail(anyString(), anyString(), anyString());
    }
}

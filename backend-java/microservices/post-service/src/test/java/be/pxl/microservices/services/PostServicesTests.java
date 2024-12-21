package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.*;
import be.pxl.microservices.client.CommentClient;
import be.pxl.microservices.client.ReviewClient;
import be.pxl.microservices.domain.Category;
import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import be.pxl.microservices.exception.PostEditForbiddenException;
import be.pxl.microservices.exception.PostNotFoundException;
import be.pxl.microservices.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PostServicesTests {

    @Mock
    private PostRepository postRepository;

    @Mock
    private ReviewClient reviewClient;

    @Mock
    private CommentClient commentClient;

    @InjectMocks
    private PostServices postServices;

    private Post post;

    @BeforeEach
    public void setUp() {
        post = Post.builder()
                .id(1L)
                .title("Sample Post")
                .content("This is a sample post.")
                .author("user1")
                .authorId(100)
                .state(PostState.CONCEPT)
                .category(Category.ALGEMEEN)
                .creationDate(LocalDateTime.now())
                .build();
    }

    @Test
    public void getAllPosts_ShouldReturnPosts() {
        // Arrange
        List<Post> posts = Arrays.asList(post);
        when(postRepository.findAll()).thenReturn(posts);

        // Act
        List<Post> result = postServices.getAllPosts();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    public void getPostById_ShouldReturnPost() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // Act
        Post result = postServices.getPostById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(post.getTitle(), result.getTitle());
        verify(postRepository, times(1)).findById(1L);
    }

    @Test
    public void getPostById_ShouldThrowException_WhenPostNotFound() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PostNotFoundException.class, () -> {
            postServices.getPostById(1L);
        });
    }

    @Test
    public void createPost_ShouldCreateAndReturnPost() {
        // Arrange
        when(postRepository.save(post)).thenReturn(post);

        // Act
        Post result = postServices.createPost(post, "user1", 100, "user1@example.com");

        // Assert
        assertNotNull(result);
        assertEquals("user1", result.getAuthor());
        assertEquals(PostState.CONCEPT, result.getState());
        verify(postRepository, times(1)).save(post);
    }

    @Test
    public void updatePost_ShouldUpdateAndReturnPost() {
        // Arrange
        Post updatedPost = Post.builder()
                .id(1L)
                .title("Updated Post")
                .content("This is the updated post.")
                .state(PostState.PUBLISHED)
                .author("user1")
                .authorId(100)
                .category(Category.ALGEMEEN)
                .creationDate(LocalDateTime.now())
                .build();

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postRepository.save(any(Post.class))).thenReturn(updatedPost);

        // Act
        Post result = postServices.updatePost(1L, updatedPost);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Post", result.getTitle());
        verify(postRepository, times(1)).save(updatedPost);
    }

    @Test
    public void updatePost_ShouldThrowException_WhenPostNotFound() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PostNotFoundException.class, () -> {
            postServices.updatePost(1L, post);
        });
    }

    @Test
    public void publishPost_ShouldPublishAndReturnPost() {
        // Arrange
        Post postToPublish = Post.builder()
                .id(1L)
                .state(PostState.APPROVED)
                .authorId(100)
                .author("user1")
                .title("Sample Post")
                .content("This post is approved.")
                .build();

        when(postRepository.findById(1L)).thenReturn(Optional.of(postToPublish));
        when(postRepository.save(any(Post.class))).thenReturn(postToPublish);

        // Act
        Post result = postServices.publishPost(1L, 100);

        // Assert
        assertNotNull(result);
        assertEquals(PostState.PUBLISHED, result.getState());
        verify(postRepository, times(1)).save(postToPublish);
    }

    @Test
    public void publishPost_ShouldThrowException_WhenPostNotFound() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PostNotFoundException.class, () -> {
            postServices.publishPost(1L, 100);
        });
    }

    @Test
    public void publishPost_ShouldThrowException_WhenUserIsNotAuthor() {
        // Arrange
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        // Act & Assert
        PostEditForbiddenException exception = assertThrows(PostEditForbiddenException.class, () -> {
            postServices.publishPost(1L, 200); // Different user ID
        });
        assertEquals("Post with id 1 cannot be edited by user with id 200", exception.getMessage());
    }

    @Test
    public void getPostByIdAndRemarks_ShouldReturnPostWithRemarks() {
        // Arrange
        PostRemarkResponse postRemarkResponse = PostRemarkResponse.builder().build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(reviewClient.getRemarksForPost(1L)).thenReturn(Arrays.asList(new RemarkResponse()));

        // Act
        PostRemarkResponse result = postServices.getPostByIdAndRemarks(1L);

        // Assert
        assertNotNull(result);
        assertEquals(post.getTitle(), result.getTitle());
        verify(postRepository, times(1)).findById(1L);
        verify(reviewClient, times(1)).getRemarksForPost(1L);
    }

    @Test
    public void getPostByIdAndComments_ShouldReturnPostWithComments() {
        // Arrange
        PostCommentResponse postCommentResponse = PostCommentResponse.builder().build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentClient.getCommentsForPost(1L)).thenReturn(Arrays.asList(new CommentResponse()));

        // Act
        PostCommentResponse result = postServices.getPostByIdAndComments(1L);

        // Assert
        assertNotNull(result);
        assertEquals(post.getTitle(), result.getTitle());
        verify(postRepository, times(1)).findById(1L);
        verify(commentClient, times(1)).getCommentsForPost(1L);
    }
}

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
import java.util.Collections;
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
        List<Post> posts = Arrays.asList(post);
        when(postRepository.findAll()).thenReturn(posts);


        List<Post> result = postServices.getAllPosts();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(postRepository, times(1)).findAll();
    }

    @Test
    public void getPostById_ShouldReturnPost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        Post result = postServices.getPostById(1L);

        assertNotNull(result);
        assertEquals(post.getTitle(), result.getTitle());
        verify(postRepository, times(1)).findById(1L);
    }

    @Test
    public void getPostById_ShouldThrowException_WhenPostNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> {
            postServices.getPostById(1L);
        });
    }

    @Test
    public void createPost_ShouldCreateAndReturnPost() {
        when(postRepository.save(post)).thenReturn(post);

        Post result = postServices.createPost(post, "user1", 100, "user1@example.com");

        assertNotNull(result);
        assertEquals("user1", result.getAuthor());
        assertEquals(PostState.CONCEPT, result.getState());
        verify(postRepository, times(1)).save(post);
    }

    @Test
    public void updatePost_ShouldUpdateAndReturnPost() {
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

        Post result = postServices.updatePost(1L, updatedPost);

        assertNotNull(result);
        assertEquals("Updated Post", result.getTitle());
        verify(postRepository, times(1)).save(updatedPost);
    }

    @Test
    public void updatePost_ShouldThrowException_WhenPostNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> {
            postServices.updatePost(1L, post);
        });
    }

    @Test
    public void publishPost_ShouldPublishAndReturnPost() {
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

        Post result = postServices.publishPost(1L, 100);

        assertNotNull(result);
        assertEquals(PostState.PUBLISHED, result.getState());
        verify(postRepository, times(1)).save(postToPublish);
    }

    @Test
    public void publishPost_ShouldThrowException_WhenPostNotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(PostNotFoundException.class, () -> {
            postServices.publishPost(1L, 100);
        });
    }

    @Test
    public void publishPost_ShouldThrowException_WhenUserIsNotAuthor() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        PostEditForbiddenException exception = assertThrows(PostEditForbiddenException.class, () -> {
            postServices.publishPost(1L, 200); // Different user ID
        });
        assertEquals("Post with id 1 cannot be edited by user with id 200", exception.getMessage());
    }
    @Test
    public void publishPost_ShouldThrowException_WhenPostNotApproved() {
        Long postId = 1L;
        int authorId = 123;
        Post post = new Post();
        post.setId(postId);
        post.setAuthorId(authorId);
        post.setState(PostState.CONCEPT);

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));

        assertThrows(PostEditForbiddenException.class, () -> postServices.publishPost(postId, authorId));
        verify(postRepository, never()).save(post);
    }

    @Test
    public void getPostByIdAndRemarks_ShouldReturnPostWithRemarks() {
        PostRemarkResponse postRemarkResponse = PostRemarkResponse.builder().build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(reviewClient.getRemarksForPost(1L)).thenReturn(Arrays.asList(new RemarkResponse()));

        PostRemarkResponse result = postServices.getPostByIdAndRemarks(1L);

        assertNotNull(result);
        assertEquals(post.getTitle(), result.getTitle());
        verify(postRepository, times(1)).findById(1L);
        verify(reviewClient, times(1)).getRemarksForPost(1L);
    }

    @Test
    public void getPostByIdAndComments_ShouldReturnPostWithComments() {
        PostCommentResponse postCommentResponse = PostCommentResponse.builder().build();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentClient.getCommentsForPost(1L)).thenReturn(Arrays.asList(new CommentResponse()));


        PostCommentResponse result = postServices.getPostByIdAndComments(1L);

        assertNotNull(result);
        assertEquals(post.getTitle(), result.getTitle());
        verify(postRepository, times(1)).findById(1L);
        verify(commentClient, times(1)).getCommentsForPost(1L);
    }
    @Test
    public void getAllPublishedPosts_ShouldReturnPublishedPosts() {

        Post publishedPost = Post.builder().id(2L).state(PostState.PUBLISHED).build();
        when(postRepository.findAllByState(PostState.PUBLISHED)).thenReturn(Arrays.asList(publishedPost));

        List<Post> result = postServices.getAllPublishedPosts();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(postRepository, times(1)).findAllByState(PostState.PUBLISHED);
    }
    @Test
    public void getAllPublishedPostsWithFilter_ShouldReturnFilteredPosts() {
        Post publishedPost = Post.builder().id(2L).state(PostState.PUBLISHED).build();
        when(postRepository.findPublishedPostsWithFilter(PostState.PUBLISHED, "sample"))
                .thenReturn(Arrays.asList(publishedPost));

        List<Post> result = postServices.getAllPublishedPostsWithFilter("sample");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(postRepository, times(1)).findPublishedPostsWithFilter(PostState.PUBLISHED, "sample");
    }
    @Test
    public void getAllConceptsPostsByAuthorId_ShouldReturnConceptPosts() {
        when(postRepository.findByAuthorIdAndState(100, PostState.CONCEPT)).thenReturn(Arrays.asList(post));

        List<Post> result = postServices.getAllConceptsPostsByAuthorId(100);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(postRepository, times(1)).findByAuthorIdAndState(100, PostState.CONCEPT);
    }
    @Test
    public void getAllPostsByAuthorIdAndStateNotByConcept_ShouldReturnNonConceptPosts() {
        Post nonConceptPost = Post.builder().id(2L).state(PostState.PUBLISHED).build();
        when(postRepository.findByAuthorIdAndStateNot(100, PostState.CONCEPT))
                .thenReturn(Arrays.asList(nonConceptPost));

        List<Post> result = postServices.getAllPostsByAuthorIdAndStateNotByConcept(100);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(postRepository, times(1)).findByAuthorIdAndStateNot(100, PostState.CONCEPT);
    }

    @Test
    public void getAllPublishedPosts_ShouldReturnEmptyList_WhenNoPostsExist() {
        when(postRepository.findAllByState(PostState.PUBLISHED)).thenReturn(Collections.emptyList());

        List<Post> result = postServices.getAllPublishedPosts();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(postRepository, times(1)).findAllByState(PostState.PUBLISHED);
    }

    @Test
    public void getPostByIdAndRemarks_ShouldHandleEmptyRemarks() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(reviewClient.getRemarksForPost(1L)).thenReturn(Collections.emptyList());

        PostRemarkResponse result = postServices.getPostByIdAndRemarks(1L);

        assertNotNull(result);
        assertEquals(0, result.getRemarks().size());
        verify(postRepository, times(1)).findById(1L);
        verify(reviewClient, times(1)).getRemarksForPost(1L);
    }
    @Test
    public void getAllReviewPosts_ShouldReturnSubmittedPosts() {
        Post submittedPost1 = Post.builder()
                .id(1L)
                .state(PostState.SUBMITTED)
                .title("Submitted Post 1")
                .build();

        Post submittedPost2 = Post.builder()
                .id(2L)
                .state(PostState.SUBMITTED)
                .title("Submitted Post 2")
                .build();

        when(postRepository.findAllByState(PostState.SUBMITTED)).thenReturn(Arrays.asList(submittedPost1, submittedPost2));

        List<Post> result = postServices.getAllReviewPosts();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(PostState.SUBMITTED, result.get(0).getState());
        assertEquals(PostState.SUBMITTED, result.get(1).getState());
        verify(postRepository, times(1)).findAllByState(PostState.SUBMITTED);
    }

    @Test
    public void getAllReviewPosts_ShouldReturnEmptyList_WhenNoSubmittedPostsExist() {
        when(postRepository.findAllByState(PostState.SUBMITTED)).thenReturn(Collections.emptyList());

        List<Post> result = postServices.getAllReviewPosts();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(postRepository, times(1)).findAllByState(PostState.SUBMITTED);
    }

}

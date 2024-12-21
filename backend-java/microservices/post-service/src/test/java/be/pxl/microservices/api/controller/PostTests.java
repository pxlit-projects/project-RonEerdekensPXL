package be.pxl.microservices.api.controller;

import be.pxl.microservices.api.dto.request.PostRequest;
import be.pxl.microservices.api.dto.request.PostUpdateRequest;
import be.pxl.microservices.api.dto.response.*;
import be.pxl.microservices.client.CommentClient;
import be.pxl.microservices.client.ReviewClient;
import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import be.pxl.microservices.repository.PostRepository;
import be.pxl.microservices.services.PostServices;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
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

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
public class PostTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @MockBean
    private ReviewClient reviewClient;

    @MockBean
    private CommentClient commentClient;


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
        postRepository.deleteAll();
    }

    @Test
    void testGetAllPosts() throws Exception {
        Post post1 = Post.builder().title("Title1").content("Content1").state(PostState.CONCEPT).build();
        Post post2 = Post.builder().title("Title2").content("Content2").state(PostState.CONCEPT).build();
        List<Post> posts = new ArrayList<>();
        posts.add(post1);
        posts.add(post2);
        postRepository.saveAll(posts);

        mockMvc.perform(MockMvcRequestBuilders.get("/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2));
    }

    @Test
    public void testGetAllReviewPosts() throws Exception {
        Post post1 = Post.builder()
                .title("Review Post 1")
                .content("Content for post 1")
                .state(PostState.SUBMITTED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post2 = Post.builder()
                .title("Review Post 2")
                .content("Content for post 2")
                .state(PostState.SUBMITTED)
                .author("Author 2")
                .authorId(2)
                .build();

        List<Post> reviewPosts = List.of(post1, post2);
        postRepository.saveAll(reviewPosts);

        List<PostResponse> expectedResponses = reviewPosts.stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .state(post.getState())
                        .author(post.getAuthor())
                        .authorId(post.getAuthorId())
                        .build())
                .toList();


        mockMvc.perform(MockMvcRequestBuilders.get("/review")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(expectedResponses)));
    }

    @Test
    public void testGetAllPublishedPostsWithoutFilter() throws Exception {

        Post post1 = Post.builder()
                .title("Published Post 1")
                .content("Content for published post 1")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post2 = Post.builder()
                .title("Published Post 2")
                .content("Content for published post 2")
                .state(PostState.PUBLISHED)
                .author("Author 2")
                .authorId(2)
                .build();

        postRepository.saveAll(List.of(post1, post2));

        List<PostResponse> expectedResponses = List.of(post1, post2).stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .state(post.getState())
                        .author(post.getAuthor())
                        .authorId(post.getAuthorId())
                        .build())
                .toList();


        mockMvc.perform(MockMvcRequestBuilders.get("/published")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(expectedResponses)));
    }

    @Test
    public void testGetAllPublishedPostsWithFilter() throws Exception {

        Post post1 = Post.builder()
                .title("Published Post 1")
                .content("Content for published post 1")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post2 = Post.builder()
                .title("Another Published Post")
                .content("Content for another published post")
                .state(PostState.PUBLISHED)
                .author("Author 2")
                .authorId(2)
                .build();

        postRepository.saveAll(List.of(post1, post2));


        String filter = "Another";


        List<PostResponse> expectedFilteredResponses = List.of(post2).stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .state(post.getState())
                        .author(post.getAuthor())
                        .authorId(post.getAuthorId())
                        .build())
                .toList();

        mockMvc.perform(MockMvcRequestBuilders.get("/published")
                        .param("filter", filter)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(1))
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(expectedFilteredResponses)));
    }

    @Test
    public void testGetAllConceptPosts() throws Exception {
        Post post1 = Post.builder()
                .title("Concept Post 1")
                .content("Content for concept post 1")
                .state(PostState.CONCEPT)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post2 = Post.builder()
                .title("Concept Post 2")
                .content("Content for concept post 2")
                .state(PostState.CONCEPT)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post3 = Post.builder()
                .title("Concept Post 3")
                .content("Content for concept post 3")
                .state(PostState.CONCEPT)
                .author("Author 2")
                .authorId(2)
                .build();

        postRepository.saveAll(List.of(post1, post2, post3));


        List<PostResponse> expectedResponses = List.of(post1, post2).stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .state(post.getState())
                        .author(post.getAuthor())
                        .authorId(post.getAuthorId())
                        .build())
                .toList();


        mockMvc.perform(MockMvcRequestBuilders.get("/concept")
                        .header("username", "Author 1")
                        .header("id", 1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(expectedResponses)));
    }

    @Test
    public void testGetAllSubmittedAndRejectedAndApprovedAndPublishedPosts() throws Exception {

        Post post1 = Post.builder()
                .title("Submitted Post 1")
                .content("Content for submitted post 1")
                .state(PostState.SUBMITTED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post2 = Post.builder()
                .title("Rejected Post 1")
                .content("Content for rejected post 1")
                .state(PostState.REJECTED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post3 = Post.builder()
                .title("Approved Post 1")
                .content("Content for approved post 1")
                .state(PostState.APPROVED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post4 = Post.builder()
                .title("Concept Post 1")
                .content("Content for concept post 1")
                .state(PostState.CONCEPT)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post5 = Post.builder()
                .title("Published Post 1")
                .content("Content for published post 1")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post post6 = Post.builder()
                .title("Published Post 2")
                .content("Content for published post 2")
                .state(PostState.PUBLISHED)
                .author("Author 2")
                .authorId(2)
                .build();

        postRepository.saveAll(List.of(post1, post2, post3, post4, post5, post6));


        List<PostResponse> expectedResponses = List.of(post1, post2, post3, post5).stream()
                .map(post -> PostResponse.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .content(post.getContent())
                        .state(post.getState())
                        .author(post.getAuthor())
                        .authorId(post.getAuthorId())
                        .build())
                .toList();


        mockMvc.perform(MockMvcRequestBuilders.get("/noconcept")
                        .header("username", "Author 1")
                        .header("id", 1)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(4))
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(expectedResponses)));
    }

    @Test
    public void testGetPostById() throws Exception {

        Post post = Post.builder()
                .id(1L)
                .title("Test Post")
                .content("This is a test post content.")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .build();

        postRepository.save(post);

        PostResponse expectedResponse = PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .state(post.getState())
                .author(post.getAuthor())
                .authorId(post.getAuthorId())
                .build();


        mockMvc.perform(MockMvcRequestBuilders.get("/{id}", 1L)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(1L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Test Post"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value("This is a test post content."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("PUBLISHED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("Author 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorId").value(1))
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(expectedResponse)));

    }

    @Test
    public void testGetPostAndRemarks() throws Exception {

        Post postToSave = Post.builder()
                .title("Test Post")
                .content("This is a test post content.")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post postsave = postRepository.save(postToSave);

        PostRemarkResponse mockResponse = PostRemarkResponse.builder()
                .id(postsave.getId())
                .title("Test Post")
                .content("This is a test post content.")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .remarks(List.of(
                        RemarkResponse.builder().id(101L).content("Remark 1").build(),
                        RemarkResponse.builder().id(102L).content("Remark 2").build()))
                .build();


        when(reviewClient.getRemarksForPost(postsave.getId())).thenReturn(mockResponse.getRemarks());


        mockMvc.perform(MockMvcRequestBuilders.get("/{id}/withremarks", postsave.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(postsave.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Test Post"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value("This is a test post content."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("PUBLISHED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("Author 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorId").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.remarks", hasSize(2)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.remarks[0].id").value(101L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.remarks[0].content").value("Remark 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.remarks[1].id").value(102L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.remarks[1].content").value("Remark 2"));
    }

    @Test
    public void testGetPostAndComments() throws Exception {
        Post postToSave = Post.builder()
                .title("Test Post")
                .content("This is a test post content.")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .build();

        Post postsave = postRepository.save(postToSave);

        PostCommentResponse mockResponse = PostCommentResponse.builder()
                .id(postsave.getId())
                .title("Test Post")
                .content("This is a test post content.")
                .state(PostState.PUBLISHED)
                .author("Author 1")
                .authorId(1)
                .comments(List.of(
                        CommentResponse.builder().id(201L).comment("Comment 1").build(),
                        CommentResponse.builder().id(202L).comment("Comment 2").build()
                ))
                .build();

        when(commentClient.getCommentsForPost(postsave.getId())).thenReturn(mockResponse.getComments());


        mockMvc.perform(MockMvcRequestBuilders.get("/{id}/withcomments", postsave.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(postsave.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Test Post"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value("This is a test post content."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("PUBLISHED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("Author 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorId").value(1))
                .andExpect(MockMvcResultMatchers.jsonPath("$.comments", hasSize(2)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.comments[0].id").value(201L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.comments[0].comment").value("Comment 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.comments[1].id").value(202L))
                .andExpect(MockMvcResultMatchers.jsonPath("$.comments[1].comment").value("Comment 2"));
    }

    @Test
    public void testCreatePost() throws Exception {
        PostRequest postRequest = PostRequest.builder()
                .title("New Post Title")
                .content("This is the content of the new post.")
                .state(PostState.CONCEPT)
                .build();

        String postRequestJson = objectMapper.writeValueAsString(postRequest);


        mockMvc.perform(MockMvcRequestBuilders.post("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postRequestJson)
                        .header("username", "Author 1")
                        .header("id", 1)
                        .header("email", "author@example.com"))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("New Post Title"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value("This is the content of the new post."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("CONCEPT"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("Author 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorId").value(1));


        assertEquals(1, postRepository.findAll().size(), "Post should be created in the database.");
    }

    @Test
    public void testUpdatePost() throws Exception {

        Post post = Post.builder()
                .title("Original Post Title")
                .content("Original content of the post.")
                .state(PostState.CONCEPT)
                .authorId(1)
                .author("Author 1")
                .email("auther1@email.com")
                .build();
        Post savedPost = postRepository.save(post);

        PostUpdateRequest postUpdateRequest = PostUpdateRequest.builder()
                .id(savedPost.getId())
                .title("Updated Post Title")
                .content("This is the updated content.")
                .state(PostState.CONCEPT)
                .authorId(1)
                .author("Author 1")
                .build();

        String postUpdateRequestJson = objectMapper.writeValueAsString(postUpdateRequest);

        mockMvc.perform(MockMvcRequestBuilders.put("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postUpdateRequestJson)
                        .header("username", "Author 1")
                        .header("id", 1))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Updated Post Title"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value("This is the updated content."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("CONCEPT"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("Author 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorId").value(1));


        Post updatedPost = postRepository.findById(savedPost.getId()).orElseThrow();
        assertEquals("Updated Post Title", updatedPost.getTitle(), "Post title should be updated.");
        assertEquals("This is the updated content.", updatedPost.getContent(), "Post content should be updated.");
        assertEquals(PostState.CONCEPT, updatedPost.getState(), "Post state should be updated.");
    }

    @Test
    public void testUpdatePostForbidden() throws Exception {

        Post post = Post.builder()
                .title("Original Post Title")
                .content("Original content of the post.")
                .state(PostState.CONCEPT)
                .authorId(1)
                .author("Author 1")
                .build();
        Post savedPost = postRepository.save(post);

        PostUpdateRequest postUpdateRequest = PostUpdateRequest.builder()
                .id(savedPost.getId())
                .title("Updated Post Title")
                .content("This is the updated content.")
                .state(PostState.CONCEPT)
                .authorId(1)
                .build();

        String postUpdateRequestJson = objectMapper.writeValueAsString(postUpdateRequest);


        mockMvc.perform(MockMvcRequestBuilders.put("/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(postUpdateRequestJson)
                        .header("username", "Author 2")
                        .header("id", 2))
                .andExpect(MockMvcResultMatchers.status().isForbidden());


        Post unchangedPost = postRepository.findById(savedPost.getId()).orElseThrow();
        assertEquals("Original Post Title", unchangedPost.getTitle(), "Post title should not be updated.");
        assertEquals("Original content of the post.", unchangedPost.getContent(), "Post content should not be updated.");
        assertEquals(PostState.CONCEPT, unchangedPost.getState(), "Post state should not be updated.");
    }

    @Test
    public void testPublishPost() throws Exception {
        Post post = Post.builder()
                .title("Original Post Title")
                .content("Original content of the post.")
                .state(PostState.APPROVED)
                .authorId(1)
                .author("Author 1")
                .build();
        Post savedPost = postRepository.save(post);

        mockMvc.perform(MockMvcRequestBuilders.post("/" + savedPost.getId() +"/publish")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Author 1")
                        .header("id", 1))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Original Post Title"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.state").value("PUBLISHED"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("Author 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.authorId").value(1));


        Post publishedPost = postRepository.findById(savedPost.getId()).orElseThrow();
        assertEquals(PostState.PUBLISHED, publishedPost.getState(), "Post state should be updated to PUBLISHED.");
    }

    @Test
    public void testPublishPostForbidden() throws Exception {
        Post post = Post.builder()
                .title("Original Post Title")
                .content("Original content of the post.")
                .state(PostState.APPROVED)
                .authorId(1)
                .author("Author 1")
                .build();
        Post savedPost = postRepository.save(post);


        mockMvc.perform(MockMvcRequestBuilders.post("/" + savedPost.getId() +"/publish")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Author 2")
                        .header("id", 2))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
        
        Post unchangedPost = postRepository.findById(savedPost.getId()).orElseThrow();
        assertEquals(PostState.APPROVED, unchangedPost.getState(), "Post state should remain APPROVED.");
    }
}

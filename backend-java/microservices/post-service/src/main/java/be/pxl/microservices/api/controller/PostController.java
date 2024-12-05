package be.pxl.microservices.api.controller;

import be.pxl.microservices.api.dto.request.PostRequest;
import be.pxl.microservices.api.dto.request.PostUpdateRequest;
import be.pxl.microservices.api.dto.response.PostResponse;
import be.pxl.microservices.domain.Post;
import be.pxl.microservices.services.IPostServices;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class PostController {
    private static final Logger log = LoggerFactory.getLogger(PostController.class);
    private final IPostServices postServices;

    @GetMapping
    public ResponseEntity getAllPosts() {
        log.info("Fetching all posts");
        return new ResponseEntity(postServices.getAllPosts().stream().map(this::mapToPostResponse).toList(), HttpStatus.OK);
    }
    @GetMapping("/review")
    public ResponseEntity getAllReviewPosts() {
        log.info("Fetching all review posts");
        return new ResponseEntity(postServices.getAllReviewPosts().stream().map(this::mapToPostResponse).toList(), HttpStatus.OK);
    }
    @GetMapping("/published")
    public ResponseEntity getAllPublishedPosts() {
        log.info("Fetching all published posts");
        return new ResponseEntity(postServices.getAllPublishedPosts().stream().map(this::mapToPostResponse).toList(), HttpStatus.OK);
    }
    @GetMapping("/concept")
    public ResponseEntity getAllConceptPosts(@RequestHeader String username, @RequestHeader int id) {
        log.info("Fetching all concept posts");
        return new ResponseEntity(postServices.getAllConceptsPostsByAuthorId(id).stream().map(this::mapToPostResponse).toList(), HttpStatus.OK);
    }
    @GetMapping("/noconcept")
    public ResponseEntity getAllSubmittedAndRejectedAndApprovedAndPublishedPosts(@RequestHeader String username, @RequestHeader int id) {
        log.info("Fetching all concept posts");
        return new ResponseEntity(postServices.getAllPostsByAuthorIdAndStateNotByConcept(id).stream().map(this::mapToPostResponse).toList(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity getPostById(@PathVariable Long id) {
        log.info("Fetching post with id: {}", id);
        Post post = postServices.getPostById(id);
        return ResponseEntity.ok(mapToPostResponse(post));
    }
    @PostMapping
    public ResponseEntity createPost(@RequestBody PostRequest postRequest, @RequestHeader String username, @RequestHeader int id) {
        log.info("Creating new post with title: {}", postRequest.getTitle());

        Post post = mapToPost(postRequest);
        return new ResponseEntity(mapToPostResponse(postServices.createPost(post, username,id)), HttpStatus.CREATED);
    }
    @PutMapping
    public ResponseEntity updatePost(@RequestBody PostUpdateRequest postRequest, @RequestHeader String username, @RequestHeader int id) {
        log.info("Updating post with id: {}", postRequest.getId());
        if(postRequest.getAuthorId() != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Post post = mapToPost(postRequest);
        return ResponseEntity.ok(mapToPostResponse(postServices.updatePost(postRequest.getId(), post)));
    }
    @PostMapping("/{postid}/publish")
    public ResponseEntity publishPost(@PathVariable Long postid, @RequestHeader String username, @RequestHeader int id) {
        log.info("Publishing post with id: {}", id);
        return ResponseEntity.ok(mapToPostResponse(postServices.publishPost(postid, id)));
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .state(post.getState())
                .creationDate(post.getCreationDate())
                .publicationDate(post.getPublicationDate())
                .author(post.getAuthor())
                .authorId(post.getAuthorId())
                .build();
    }
    private Post mapToPost(PostRequest postRequest) {
        return Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .state(postRequest.getState())
                .build();
    }
    private Post mapToPost(PostUpdateRequest postRequest) {
        return Post.builder()
                .id(postRequest.getId())
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .state(postRequest.getState())
                .author(postRequest.getAuthor())
                .authorId(postRequest.getAuthorId())
                .creationDate(postRequest.getCreationDate())
                .publicationDate(postRequest.getPublicationDate())
                .build();
    }
}

package be.pxl.microservices.api.controller;

import be.pxl.microservices.api.dto.request.PostRequest;
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
    @GetMapping("/{id}")
    public ResponseEntity getPostById(@PathVariable Long id) {
        log.info("Fetching post with id: {}", id);
        Post post = postServices.getPostById(id);
        return ResponseEntity.ok(mapToPostResponse(post));
    }
    @PostMapping
    public ResponseEntity createPost(@RequestBody PostRequest postRequest) {
        log.info("Creating new post with title: {}", postRequest.getTitle());
        Post post = mapToPost(postRequest);
        return new ResponseEntity(mapToPostResponse(postServices.createPost(post)), HttpStatus.CREATED);
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .published(post.isPublished())
                .concept(post.isConcept())
                .creationDate(post.getCreationDate())
                .publicationDate(post.getPublicationDate())
                .build();
    }
    private Post mapToPost(PostRequest postRequest) {
        return Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .build();
    }
}

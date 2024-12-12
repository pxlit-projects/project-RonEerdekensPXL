package be.pxl.microservices.api.controller;

import be.pxl.microservices.api.dto.request.CommentRequest;
import be.pxl.microservices.api.dto.response.CommentResponse;
import be.pxl.microservices.domain.Comment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import be.pxl.microservices.services.ICommentService;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class CommentController {
    private static final Logger log = LoggerFactory.getLogger(CommentController.class);
    private final ICommentService commentService;


    @PostMapping
    public ResponseEntity createComment(@RequestBody CommentRequest commentRequest, @RequestHeader String username, @RequestHeader int id) {
        log.info("Creating new comment");
        Comment comment = mapToComment(commentRequest);
        return new ResponseEntity(commentService.createComment(comment, username,id), HttpStatus.CREATED);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity getCommentsByPostId(@PathVariable Long postId) {
        log.info("Fetching comments for post with id: {}", postId);
        return new ResponseEntity(commentService.getCommentsByPostId(postId).stream().map(this::mapToCommentResponse).toList(), HttpStatus.OK);
    }

    private Comment mapToComment(CommentRequest commentRequest) {
        return Comment.builder()
                .postId(commentRequest.getPostId())
                .comment(commentRequest.getComment())
                .build();
    }
    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .comment(comment.getComment())
                .creationDate(comment.getCreationDate())
                .authorId(comment.getAuthorId())
                .author(comment.getAuthor())
                .build();
    }
}

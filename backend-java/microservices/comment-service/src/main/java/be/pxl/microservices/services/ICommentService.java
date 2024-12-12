package be.pxl.microservices.services;

import be.pxl.microservices.domain.Comment;

import java.util.List;

public interface ICommentService {
    Comment createComment(Comment comment, String username, int id);
    List<Comment> getCommentsByPostId(Long postId);
}

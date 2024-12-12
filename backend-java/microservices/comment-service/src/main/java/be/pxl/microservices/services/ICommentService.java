package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.request.CommentRequest;
import be.pxl.microservices.domain.Comment;

import java.util.List;

public interface ICommentService {
    Comment createComment(Comment comment, String username, int id);
    List<Comment> getCommentsByPostId(Long postId);

    void deleteComment(Long commentId, String username, int id);

    Comment updateComment(Long commentId, CommentRequest commentRequest, String username, int id);
}

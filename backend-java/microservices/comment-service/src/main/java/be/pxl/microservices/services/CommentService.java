package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.request.CommentRequest;
import be.pxl.microservices.api.dto.response.CommentResponse;
import be.pxl.microservices.domain.Comment;
import be.pxl.microservices.exception.CommentNotFoundException;
import be.pxl.microservices.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private final CommentRepository commentRepository;

    @Override
    public Comment createComment(Comment comment, String username, int id) {
        comment.setAuthor(username);
        comment.setAuthorId(id);
        comment.setCreationDate(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findAllByPostId(postId);
    }

    @Override
    public void deleteComment(Long commentId, String username, int id) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment with id " + commentId + " not found"));
        if (comment.getAuthorId() != id) {
            throw new IllegalArgumentException("You are not the author of this comment");
        }
        commentRepository.delete(comment);

    }

    @Override
    public Comment updateComment(Long commentId, CommentRequest commentRequest, String username, int id) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment with id " + commentId + " not found"));
        if (comment.getAuthorId() != id) {
            throw new IllegalArgumentException("You are not the author of this comment");
        }
        comment.setComment(commentRequest.getComment());
        commentRepository.save(comment);
        return comment;
    }

    @Override
    public List<Comment> getAllCommentsByUserId(int id) {
        return commentRepository.findAllByAuthorId(id);
    }
}

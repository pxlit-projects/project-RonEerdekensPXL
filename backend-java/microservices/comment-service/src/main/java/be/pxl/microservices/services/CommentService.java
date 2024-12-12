package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.CommentResponse;
import be.pxl.microservices.domain.Comment;
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
}

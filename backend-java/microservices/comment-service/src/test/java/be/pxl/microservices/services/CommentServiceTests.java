package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.request.CommentRequest;
import be.pxl.microservices.domain.Comment;
import be.pxl.microservices.exception.CommentNotFoundException;
import be.pxl.microservices.repository.CommentRepository;
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

import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CommentServiceTests {
    @Mock
    private CommentRepository commentRepository;
    @InjectMocks
    private CommentService commentService;

    private Comment comment;
    private CommentRequest commentRequest;

    @BeforeEach
    public void setUp() {
        comment = Comment.builder()
                .id(1L)
                .comment("This is a comment")
                .author("user1")
                .authorId(100)
                .creationDate(LocalDateTime.now())
                .build();

        commentRequest = new CommentRequest();
        commentRequest.setComment("Updated comment");
    }

    @Test
    public void createComment_ShouldCreateAndReturnComment() {
        // Arrange
        when(commentRepository.save(comment)).thenReturn(comment);

        // Act
        Comment result = commentService.createComment(comment, "user1", 100);

        // Assert
        assertNotNull(result);
        assertEquals("user1", result.getAuthor());
        assertEquals(100, result.getAuthorId());
        verify(commentRepository, times(1)).save(comment);
    }

    @Test
    public void getCommentsByPostId_ShouldReturnComments() {
        // Arrange
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findAllByPostId(1L)).thenReturn(comments);

        // Act
        List<Comment> result = commentService.getCommentsByPostId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("This is a comment", result.get(0).getComment());
        verify(commentRepository, times(1)).findAllByPostId(1L);
    }

    @Test
    public void deleteComment_ShouldDeleteComment() {
        // Arrange
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        // Act
        commentService.deleteComment(1L, "user1", 100);

        // Assert
        verify(commentRepository, times(1)).delete(comment);
    }

    @Test
    public void deleteComment_ShouldThrowException_WhenCommentNotFound() {
        // Arrange
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () -> {
            commentService.deleteComment(1L, "user1", 100);
        });
    }

    @Test
    public void deleteComment_ShouldThrowException_WhenUserIsNotAuthor() {
        // Arrange
        comment = Comment.builder()
                .id(1L)
                .comment("This is a comment")
                .author("user1")
                .authorId(200) // Different author ID
                .creationDate(LocalDateTime.now())
                .build();
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.deleteComment(1L, "user2", 201);
        });
        assertEquals("You are not the author of this comment", exception.getMessage());
    }

    @Test
    public void updateComment_ShouldUpdateAndReturnComment() {
        // Arrange
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(comment)).thenReturn(comment);

        // Act
        Comment updatedComment = commentService.updateComment(1L, commentRequest, "user1", 100);

        // Assert
        assertNotNull(updatedComment);
        assertEquals("Updated comment", updatedComment.getComment());
        verify(commentRepository, times(1)).save(updatedComment);
    }

    @Test
    public void updateComment_ShouldThrowException_WhenCommentNotFound() {
        // Arrange
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(CommentNotFoundException.class, () -> {
            commentService.updateComment(1L, commentRequest, "user1", 100);
        });
    }

    @Test
    public void updateComment_ShouldThrowException_WhenUserIsNotAuthor() {
        // Arrange
        comment = Comment.builder()
                .id(1L)
                .comment("This is a comment")
                .author("user1")
                .authorId(200) // Different author ID
                .creationDate(LocalDateTime.now())
                .build();
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            commentService.updateComment(1L, commentRequest, "user2", 201);
        });
        assertEquals("You are not the author of this comment", exception.getMessage());
    }

    @Test
    public void getAllCommentsByUserId_ShouldReturnComments() {
        // Arrange
        List<Comment> comments = Arrays.asList(comment);
        when(commentRepository.findAllByAuthorId(100)).thenReturn(comments);

        // Act
        List<Comment> result = commentService.getAllCommentsByUserId(100);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("This is a comment", result.get(0).getComment());
        verify(commentRepository, times(1)).findAllByAuthorId(100);
    }
}

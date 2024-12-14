package be.pxl.microservices.api.dto.response;

import be.pxl.microservices.domain.Category;
import be.pxl.microservices.domain.PostState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCommentResponse {
    private Long id;
    private String title;
    private String content;
    private PostState state;
    private String author;
    private int authorId;
    private LocalDateTime creationDate;
    private LocalDateTime publicationDate;
    List<CommentResponse> comments;
    private Category category;
}

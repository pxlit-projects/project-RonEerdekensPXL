package be.pxl.microservices.api.dto.request;

import be.pxl.microservices.domain.PostState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateRequest {
    private Long id;
    private String title;
    private String content;
    private PostState state;
    private String author;
    private int authorId;
    private LocalDateTime creationDate;
    private LocalDateTime publicationDate;
}

package be.pxl.microservices.api.dto.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemarkResponse {
    private Long id;
    private Long postId;
    private String content;
    private LocalDateTime creationDate;
    private String reviewer;
    private int reviewerId;
}

package be.pxl.microservices.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

        private Long id;
        private String title;
        private String content;
        private boolean published;
        private boolean concept;
        private LocalDateTime creationDate;
        private LocalDateTime publicationDate;
}

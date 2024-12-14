package be.pxl.microservices.api.dto.request;

import be.pxl.microservices.domain.Category;
import be.pxl.microservices.domain.PostState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {

        private String title;
        private String content;
        private PostState state;
        private Category category;

}

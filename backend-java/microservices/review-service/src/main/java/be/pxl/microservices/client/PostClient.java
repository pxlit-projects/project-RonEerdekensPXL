package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.PostResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "post-service")
public interface PostClient {

    @GetMapping("/review")
    List<PostResponse> getReviewPosts();
}

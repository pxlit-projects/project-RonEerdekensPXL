package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.PostResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "post-service")
public interface PostClient {

    @GetMapping("/review")
    @CircuitBreaker(name = "post-service", fallbackMethod = "fallbackGetReviewPosts")
    List<PostResponse> getReviewPosts();


    default List<PostResponse> fallbackGetReviewPosts(Throwable throwable) {
        return List.of();
    }
}

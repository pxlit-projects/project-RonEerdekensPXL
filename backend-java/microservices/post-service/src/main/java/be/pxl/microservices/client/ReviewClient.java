package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.CommentResponse;
import be.pxl.microservices.api.dto.response.RemarkResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "review-service")
public interface ReviewClient {

    @GetMapping("posts/{postId}/remarks")
    @CircuitBreaker(name = "review-service", fallbackMethod = "fallbackGetRemarksForPost")
    List<RemarkResponse> getRemarksForPost(@PathVariable Long postId);

    default List<RemarkResponse> fallbackGetRemarksForPost(Throwable throwable) {
        return List.of();
    }
}

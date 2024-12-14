package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.CommentResponse;
import be.pxl.microservices.api.dto.response.RemarkResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "review-service")
public interface ReviewClient {
    @Autowired
    static final Logger log = LoggerFactory.getLogger(ReviewClient.class);

    @GetMapping("posts/{postId}/remarks")
    @CircuitBreaker(name = "review-service", fallbackMethod = "fallbackGetRemarksForPost")
    List<RemarkResponse> getRemarksForPost(@PathVariable Long postId);

    default List<RemarkResponse> fallbackGetRemarksForPost(Throwable throwable) {
        log.error("Error occurred while fetching remarks for post");
        return List.of();
    }
}

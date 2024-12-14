package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.CommentResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "comment-service")
public interface CommentClient {

    @Autowired
    static final Logger log = LoggerFactory.getLogger(CommentClient.class);

    @GetMapping("post/{postId}")
    @CircuitBreaker(name = "comment-service", fallbackMethod = "fallbackGetCommentsForPost")
    List<CommentResponse> getCommentsForPost(@PathVariable Long postId);

    default List<CommentResponse> fallbackGetCommentsForPost(Throwable throwable) {
        log.error("Error occurred while fetching comments for post");
        return List.of();
    }
}

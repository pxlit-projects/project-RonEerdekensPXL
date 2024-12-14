package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.PostResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "post-service")
public interface PostClient {
    @Autowired
    static final Logger log = LoggerFactory.getLogger(PostClient.class);

    @GetMapping("/review")
    @CircuitBreaker(name = "post-service", fallbackMethod = "fallbackGetReviewPosts")
    List<PostResponse> getReviewPosts();


    default List<PostResponse> fallbackGetReviewPosts(Throwable throwable) {
        log.error("Error occurred while fetching review posts");
        return List.of();
    }
}

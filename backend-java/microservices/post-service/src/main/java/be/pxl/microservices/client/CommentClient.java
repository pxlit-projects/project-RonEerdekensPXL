package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.CommentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "comment-service")
public interface CommentClient {

    @GetMapping("post/{postId}")
    List<CommentResponse> getCommentsForPost(@PathVariable Long postId);
}

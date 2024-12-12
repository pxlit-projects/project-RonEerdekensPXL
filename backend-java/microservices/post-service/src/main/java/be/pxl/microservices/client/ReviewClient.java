package be.pxl.microservices.client;

import be.pxl.microservices.api.dto.response.RemarkResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "review-service")
public interface ReviewClient {

    @GetMapping("posts/{postId}/remarks")
    List<RemarkResponse> getRemarksForPost(@PathVariable Long postId);
}

package be.pxl.microservices.api.controller;

import be.pxl.microservices.api.dto.request.RemarkRequest;
import be.pxl.microservices.api.dto.response.PostResponse;
import be.pxl.microservices.domain.Remark;
import be.pxl.microservices.services.IReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ReviewController {
    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);
    private final IReviewService reviewService;

    @GetMapping("/posts")
    public ResponseEntity getReviewPosts() {
        log.info("Fetching all review posts");
        List<PostResponse> posts = reviewService.getReviewPosts();
        return new ResponseEntity(posts, HttpStatus.OK);

    }

    @PostMapping("/posts/{id}/approve")
    public ResponseEntity approvePost(@PathVariable Long id) {
        log.info("Approving post with id: {}", id);
        reviewService.approvePost(id);
        return new ResponseEntity(HttpStatus.OK);
    }
    @PostMapping("/posts/{postId}/reject")
    public ResponseEntity rejectPost(@PathVariable Long postId, @RequestHeader String username, @RequestHeader int id, @RequestBody RemarkRequest remarkRequest) {
        log.info("Rejecting post with id: {}", postId);
        Remark remark = mapToRemark(remarkRequest);
        reviewService.rejectPost(postId, username, id, remark);
        return new ResponseEntity(HttpStatus.OK);
    }

    private Remark mapToRemark(RemarkRequest remarkRequest) {
        return Remark.builder()
                .postId(remarkRequest.getPostId())
                .content(remarkRequest.getContent())
                .build();
    }
}

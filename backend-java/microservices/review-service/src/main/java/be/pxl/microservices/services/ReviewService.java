package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.PostResponse;
import be.pxl.microservices.client.PostClient;
import be.pxl.microservices.repository.RemarkRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);
    private final RemarkRepository remarkRepository;
    private final PostClient postClient;

    public List<PostResponse> getReviewPosts() {
        return postClient.getReviewPosts();
    }
}

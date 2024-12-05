package be.pxl.microservices.services;

import be.pxl.microservices.api.dto.response.PostResponse;
import be.pxl.microservices.client.PostClient;
import be.pxl.microservices.repository.RemarkRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);
    private final RemarkRepository remarkRepository;
    private final PostClient postClient;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Override
    public List<PostResponse> getReviewPosts() {
        return postClient.getReviewPosts();
    }

    @Override
    public void approvePost(Long id) {
        rabbitTemplate.convertAndSend("approvePostQueue", id);
    }
}

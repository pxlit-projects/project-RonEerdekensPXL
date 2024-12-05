package be.pxl.microservices.services;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import be.pxl.microservices.exception.PostNotFoundException;
import be.pxl.microservices.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QueueService {
    private final PostRepository postRepository;

    @RabbitListener(queues = "approvePostQueue")
    public void approvePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found"));
        post.setState(PostState.APPROVED);
        postRepository.save(post);
    }
    @RabbitListener(queues = "rejectPostQueue")
    public void rejectPost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found"));
        post.setState(PostState.REJECTED);
        postRepository.save(post);
    }
}

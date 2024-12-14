package be.pxl.microservices.services;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.PostState;
import be.pxl.microservices.exception.PostNotFoundException;
import be.pxl.microservices.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class QueueService {
    private final PostRepository postRepository;
    private final MailSenderService mailSenderService;
    private static final Logger log = Logger.getLogger(QueueService.class.getName());

    @RabbitListener(queues = "approvePostQueue")
    public void approvePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found"));
        post.setState(PostState.APPROVED);
        postRepository.save(post);
        log.info("Post with id " + id + " has been approved");
        mailSenderService.sendNewMail(post.getEmail(), "Post approved with title: '" + post.getTitle() + "'", "Your post '"+ post.getTitle() + "' has been approved");
    }
    @RabbitListener(queues = "rejectPostQueue")
    public void rejectPost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Post not found"));
        post.setState(PostState.REJECTED);
        postRepository.save(post);
        log.info("Post with id " + id + " has been rejected");
        mailSenderService.sendNewMail(post.getEmail(), "Post rejected with title " + post.getTitle(), "Your post '"+ post.getTitle() + "' has been rejected" +
                "\nPlease check the remarks in the review service");
    }
}

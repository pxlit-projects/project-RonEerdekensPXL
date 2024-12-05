package be.pxl.microservices.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfiguration {
    @Bean
    public Queue myApprovePostQueue() {
        return new Queue("approvePostQueue", true);
    }
    @Bean
    public Queue myRejectPostQueue() {
        return new Queue("rejectPostQueue", true);
    }
}

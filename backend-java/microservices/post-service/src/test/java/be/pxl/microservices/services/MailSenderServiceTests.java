package be.pxl.microservices.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MailSenderServiceTests {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private MailSenderService mailSenderService;

    @Test
    public void sendNewMail_ShouldSendEmail() {
        String to = "test@example.com";
        String subject = "Test Subject";
        String body = "This is a test email.";

        ArgumentCaptor<SimpleMailMessage> mailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

        mailSenderService.sendNewMail(to, subject, body);

        verify(mailSender, times(1)).send(mailCaptor.capture());
        SimpleMailMessage capturedMessage = mailCaptor.getValue();

        assertEquals(to, Objects.requireNonNull(capturedMessage.getTo())[0], "Recipient email does not match.");
        assertEquals(subject, capturedMessage.getSubject(), "Email subject does not match.");
        assertEquals(body, capturedMessage.getText(), "Email body does not match.");
    }

    @Test
    public void sendNewMail_ShouldLogSendingEmail() {

        String to = "test@example.com";
        String subject = "Test Subject";
        String body = "This is a test email.";

        mailSenderService.sendNewMail(to, subject, body);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));

    }
}

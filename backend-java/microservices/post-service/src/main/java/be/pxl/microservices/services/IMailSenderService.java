package be.pxl.microservices.services;

public interface IMailSenderService {
    void sendNewMail(String to, String subject, String body);
}

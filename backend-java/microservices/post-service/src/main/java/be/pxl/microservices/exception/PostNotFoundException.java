package be.pxl.microservices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Post not found")
public class PostNotFoundException extends RuntimeException{
    public PostNotFoundException() { }
    public PostNotFoundException(String message) { super(message); }
    public PostNotFoundException(String message, Throwable cause) { super(message, cause); }
}

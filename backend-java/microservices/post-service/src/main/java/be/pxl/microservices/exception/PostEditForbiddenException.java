package be.pxl.microservices.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "Post edit forbidden")
public class PostEditForbiddenException extends RuntimeException {
    public PostEditForbiddenException() {
    }

    public PostEditForbiddenException(String message) {
        super(message);
    }

    public PostEditForbiddenException(String message, Throwable cause) {
        super(message, cause);
    }
}

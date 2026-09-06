package com.ziplink.user_service.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<String> handleDuplicateUserException(RuntimeException e){
        logger.error(e.getMessage());
        return ResponseEntity.badRequest()
                .body(e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleAllOtherExceptions(RuntimeException e){
        logger.error(e.getMessage());
        return ResponseEntity.badRequest()
                .body("Something went wrong, please contact system admin.");
    }
}

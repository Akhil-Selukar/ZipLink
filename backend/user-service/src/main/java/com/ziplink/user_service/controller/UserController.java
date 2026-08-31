package com.ziplink.user_service.controller;

import com.ziplink.user_service.dto.UserRequestDTO;
import com.ziplink.user_service.entity.UserEntity;
import com.ziplink.user_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewEmployee(@Valid @RequestBody UserRequestDTO userRequestDTO, HttpServletRequest request) {
        logger.info("Received user creation request");
        UserEntity savedUser = userService.createNewUser(userRequestDTO, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User "+savedUser.getUserName() +" created successfully");
    }
}

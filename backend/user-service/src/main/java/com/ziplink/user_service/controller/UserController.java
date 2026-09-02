package com.ziplink.user_service.controller;

import com.ziplink.common_libs.dto.UserAuthDetailsResponseDTO;
import com.ziplink.user_service.dto.UserRequestDTO;
import com.ziplink.user_service.entity.UserEntity;
import com.ziplink.user_service.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewUser(@Valid @RequestBody UserRequestDTO userRequestDTO) {
        logger.info("Received user creation request");
        UserEntity savedUser = userService.createNewUser(userRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User "+savedUser.getUserName() +" created successfully");
    }

    @GetMapping("/findByEmail/{email}")
    public ResponseEntity<UserAuthDetailsResponseDTO> findUserByEmail(@PathVariable String email){
        logger.info("Received request to find user by email");
        UserAuthDetailsResponseDTO response = userService.getUserAuthDetailsByEmail(email);

        return ResponseEntity.status(HttpStatus.OK)
                .body(response);
    }
}

package com.ziplink.user_service.service;

import com.ziplink.user_service.dto.UserRequestDTO;
import com.ziplink.user_service.entity.LoginDetailsEntity;
import com.ziplink.user_service.entity.UserEntity;
import com.ziplink.user_service.exception.DuplicateUserException;
import com.ziplink.user_service.repository.UserLoginRepository;
import com.ziplink.user_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final UserLoginRepository loginRepository;

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, UserLoginRepository loginRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.loginRepository = loginRepository;
    }

    @Transactional
    public UserEntity createNewUser(UserRequestDTO userRequestDTO) {
        logger.debug("Creating user : "+userRequestDTO.getUserName());
        // check if user already exist
        if(userRepository.existsByEmail(userRequestDTO.getEmailId())) {
            logger.warn("User "+userRequestDTO.getUserName()+" already exist");
            throw new DuplicateUserException("User with email "+userRequestDTO.getEmailId()+" already exists");
        }

        UserEntity user = new UserEntity();
        user.setUserName(userRequestDTO.getUserName());
        user.setEmail(userRequestDTO.getEmailId());

        UserEntity savedUser = userRepository.save(user);

        LoginDetailsEntity loginDetails = new LoginDetailsEntity();
        loginDetails.setUser(savedUser);
        loginDetails.setEmail(userRequestDTO.getEmailId());
        loginDetails.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));

        loginRepository.save(loginDetails);
        logger.debug("User created successfully.");
        return savedUser;
    }

    public boolean checkUserByEmail(String userEmail) {
        return userRepository.existsByEmail(userEmail);
    }

}

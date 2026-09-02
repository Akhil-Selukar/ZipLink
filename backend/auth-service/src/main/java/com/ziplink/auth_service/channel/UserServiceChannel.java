package com.ziplink.auth_service.channel;

import com.ziplink.common_libs.dto.UserAuthDetailsResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class UserServiceChannel {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceChannel.class);

    @Qualifier("useServiceClient")
    private final WebClient userServiceClient;

    public UserServiceChannel(WebClient userServiceClient) {
        this.userServiceClient = userServiceClient;
    }


    public UserAuthDetailsResponseDTO fetchUserDetails(String email){
        logger.debug("Sending request to user service via UserServiceChannel.");
        return userServiceClient.get()
                .uri("/v1/user/findByEmail/{email}", email)
                .retrieve()
                .bodyToMono(UserAuthDetailsResponseDTO.class)
                .block();
    }

}

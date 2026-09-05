package com.ziplink.url_service.channel;

import com.ziplink.url_service.exception.UserNotFoundException;
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


    public Long fetchUserId(String email){
        logger.debug("Sending request to user service via UserServiceChannel.");
        try {
            return userServiceClient.get()
                    .uri("/v1/user/userId/{email}", email)
                    .retrieve()
                    .bodyToMono(Long.class)
                    .block();
        } catch(Exception e){
            throw new UserNotFoundException("User not found..!!");
        }
    }
}

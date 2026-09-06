package com.ziplink.common_libs.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @ConditionalOnProperty(name = "baseUrl.user-service")
    public WebClient useServiceClient(@Value("${baseUrl.user-service}") String userServiceUrl) {
        return WebClient.builder()
                .baseUrl(userServiceUrl)
                .build();
    }

    @Bean
    @ConditionalOnProperty(name = "baseUrl.analytics-service")
    public WebClient analyticsServiceClient(@Value("${baseUrl.analytics-service}") String analyticsServiceUrl) {
        return WebClient.builder()
                .baseUrl(analyticsServiceUrl)
                .build();
    }
}

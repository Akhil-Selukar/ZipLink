package com.ziplink.url_service.channel;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AnalyticsServiceChannel {
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsServiceChannel.class);

    private final WebClient analyticsServiceClient;

    public AnalyticsServiceChannel(@Qualifier("analyticsServiceClient")WebClient analyticsServiceClient){
        this.analyticsServiceClient = analyticsServiceClient;
    }

    public Long deleteAnalytics(String shortUrl){
        logger.debug("Sending request to analytics service via analyticsServiceChannel.");
        try {
            return analyticsServiceClient.delete()
                    .uri("/v1/analytics/delete/{shortUrl}", shortUrl)
                    .retrieve()
                    .bodyToMono(Long.class)
                    .block();
        } catch(Exception e){
            throw new RuntimeException("Analytics service call failed..");
        }
    }

}

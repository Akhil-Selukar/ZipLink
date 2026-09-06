package com.ziplink.analytics_service.service;

import com.ziplink.analytics_service.channel.UserServiceChannel;
import com.ziplink.analytics_service.dto.AnalyticResponseDTO;
import com.ziplink.analytics_service.repository.AnalyticsRepository;
import com.ziplink.analytics_service.repository.ClickCountProjection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);

    private final UserServiceChannel userServiceChannel;

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(UserServiceChannel userServiceChannel, AnalyticsRepository repository) {
        this.userServiceChannel = userServiceChannel;
        this.analyticsRepository = repository;
    }

    public List<AnalyticResponseDTO> getAnalyticsByUserEmail(String userEmail){
        logger.debug("Fetching analytics for user {}", userEmail);
        long userId = userServiceChannel.fetchUserId(userEmail);

        List<ClickCountProjection> response = analyticsRepository.getClickCountsByUserId(userId);

        List<AnalyticResponseDTO> details = new ArrayList<>();
        for(ClickCountProjection record:response){
            details.add(new AnalyticResponseDTO(record.getUrlName(), record.getShortUrl(), record.getCount()));
        }

        return details;
    }

    @Transactional
    public long deleteAnalyticsByShortUrl(String shortUrl) {
        logger.debug("Deleting analytics for url {}",shortUrl);
        return analyticsRepository.deleteByShortUrl(shortUrl);
    }
}

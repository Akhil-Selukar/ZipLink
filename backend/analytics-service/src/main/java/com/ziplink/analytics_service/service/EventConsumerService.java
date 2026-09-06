package com.ziplink.analytics_service.service;

import com.ziplink.analytics_service.entity.EventEntity;
import com.ziplink.analytics_service.repository.AnalyticsRepository;
import com.ziplink.common_libs.dto.ClickEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Service
public class EventConsumerService {
    private static final Logger logger = LoggerFactory.getLogger(EventConsumerService.class);
    private final AnalyticsRepository analyticsRepository;

    public EventConsumerService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @KafkaListener(topics = "click-events", groupId = "click-event-group")
    public void consume(ClickEvent record, Acknowledgment ack) {
        logger.info("Message received {} ",record);

        EventEntity event = new EventEntity();
        event.setShortUrl(record.getShortUrl());
        event.setUserId(record.getUserId());
        event.setUrlName(record.getUrlName());
        event.setIp(record.getIp());
        event.setTimestamp(record.getTimestamp());

        analyticsRepository.save(event);
        ack.acknowledge(); // commit offset ONLY after DB save success this will prevent record miss.
    }
}

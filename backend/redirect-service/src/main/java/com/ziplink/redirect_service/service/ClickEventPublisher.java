package com.ziplink.redirect_service.service;

import com.ziplink.redirect_service.dto.ClickEvent;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class ClickEventPublisher {
    private static final Logger logger = LoggerFactory.getLogger(ClickEventPublisher.class);
    private final ClickEventQueue queue;
    private final KafkaTemplate<String, ClickEvent> kafkaTemplate;

    private final ExecutorService executor;

    public ClickEventPublisher(ClickEventQueue queue, KafkaTemplate<String, ClickEvent> kafkaTemplate) {
        this.queue = queue;
        this.kafkaTemplate = kafkaTemplate;
        executor = Executors.newSingleThreadExecutor();
    }

    @PostConstruct
    public void start() {
        executor.submit(this::processLoop);
    }

    private void processLoop() {
        while (true) {
            try {
                List<ClickEvent> batch = queue.drainBatch(1000);

                if (batch.isEmpty()) {
                    Thread.sleep(100);
                    continue;
                }

                for (ClickEvent event : batch) {
                    kafkaTemplate.send(
                            "click-events",
                            event
                    );
                }

            } catch (Exception e) {
                logger.warn("Click event failed to publish");
                e.printStackTrace();
            }
        }
    }
}

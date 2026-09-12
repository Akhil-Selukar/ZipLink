package com.ziplink.redirect_service.config;

import com.ziplink.common_libs.dto.ClickEvent;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JacksonJsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaPublisherConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, ClickEvent> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();

        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JacksonJsonSerializer.class);

        // High throughput settings
        configProps.put(ProducerConfig.ACKS_CONFIG, "all"); // ensure durability
        configProps.put(ProducerConfig.RETRIES_CONFIG, 5);   // retry on failure
        configProps.put(ProducerConfig.LINGER_MS_CONFIG, 20); // batch small events for 20ms
        configProps.put(ProducerConfig.BATCH_SIZE_CONFIG, 32*1024); // 32 KB batch
        configProps.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "snappy"); // compress batch
        configProps.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 67108864); // buffer memory

        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, ClickEvent> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}

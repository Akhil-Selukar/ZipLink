package com.ziplink.url_service.config;

import com.ziplink.url_service.util.Base62Encoder;
import com.ziplink.url_service.util.SnowflakeIdGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IdGeneratorConfig {
    private final long machineId;

    public IdGeneratorConfig(@Value("${app.machine-id}")long machineId) {
        this.machineId = machineId;
    }

    @Bean
    public SnowflakeIdGenerator snowflakeIdGenerator() {
        return new SnowflakeIdGenerator(machineId);
    }

    @Bean
    public Base62Encoder base62Encoder(){
        return new Base62Encoder();
    }
}

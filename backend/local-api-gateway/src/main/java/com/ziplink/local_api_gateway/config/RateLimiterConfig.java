package com.ziplink.local_api_gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver userKeyResolver() {

        return exchange -> exchange.getPrincipal()
                // Authenticated request, use JWT sub (i.e. email here) as the rate-limit key.
                .map(java.security.Principal::getName)

                // Public request:
                .switchIfEmpty(
                        Mono.defer(() -> {
                            var remoteAddress =
                                    exchange.getRequest()
                                            .getRemoteAddress();

                            if (remoteAddress == null ||
                                    remoteAddress.getAddress() == null) {

                                return Mono.just("unknown-client");
                            }

                            return Mono.just(remoteAddress
                                    .getAddress()
                                    .getHostAddress());
                        })
                );
    }
}
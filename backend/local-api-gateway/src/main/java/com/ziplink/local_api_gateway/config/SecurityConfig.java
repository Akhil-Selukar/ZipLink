package com.ziplink.local_api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.server.WebFilter;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(
            ServerHttpSecurity http) {

        return http
                .cors(cors -> {})
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()    // allow all preflight requests
                        // Public endpoints
                        .pathMatchers(
                                "/v1/auth/**",
                                "/v1/user/create",
                                "/r/**"
                        ).permitAll()
                        // Everything else requires a valid JWT
                        .anyExchange().authenticated()
                ).oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {})).build();
    }

    @Bean
    public WebFilter userEmailHeaderFilter() {

        return (exchange, chain) -> {

            // remove existing X-User-Email if exist
            ServerHttpRequest sanitizedRequest = exchange.getRequest()
                    .mutate()
                    .headers(headers -> headers.remove("X-User-Email"))
                    .build();

            return exchange.mutate()
                    .request(sanitizedRequest)
                    .build()
                    .getPrincipal()
                    .filter(JwtAuthenticationToken.class::isInstance)
                    .cast(JwtAuthenticationToken.class)
                    .map(jwtAuthentication -> {

                        String userIdentity = jwtAuthentication.getName();

                        ServerHttpRequest authenticatedRequest = sanitizedRequest
                                .mutate()
                                .header("X-User-Email", userIdentity)
                                .build();

                        return exchange.mutate()
                                .request(authenticatedRequest)
                                .build();
                    })

                    // If request is public, keep the sanitized request.
                    .defaultIfEmpty(exchange.mutate()
                            .request(sanitizedRequest)
                            .build()
                    )
                    .flatMap(chain::filter);
        };
    }
}

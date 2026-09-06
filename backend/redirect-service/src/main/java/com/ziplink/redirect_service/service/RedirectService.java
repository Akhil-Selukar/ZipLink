package com.ziplink.redirect_service.service;

import com.ziplink.common_libs.dto.ClickEvent;
import com.ziplink.redirect_service.entity.UrlMappingEntity;
import com.ziplink.redirect_service.repository.RedirectUrlRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedirectService {

    private static final Logger logger = LoggerFactory.getLogger(RedirectService.class);
    private final RedisTemplate redisTemplate;
    private final RedirectUrlRepository urlRepository;
    private final ClickEventQueue clickEventQueue;

    public RedirectService(RedisTemplate redisTemplate, RedirectUrlRepository urlRepository, ClickEventQueue clickEventQueue) {
        this.redisTemplate = redisTemplate;
        this.urlRepository = urlRepository;
        this.clickEventQueue = clickEventQueue;
    }

    public String getUrlMapping(String shortUrl, HttpServletRequest request) {
        UrlMappingEntity mapping;
        String longUrl = null;
        String redisKey = "url : " + shortUrl;
        if (redisTemplate.hasKey(redisKey)) {
            logger.debug("Cache hit for url {}", shortUrl);
            mapping = (UrlMappingEntity) redisTemplate.opsForValue().get(redisKey);
        } else {
            logger.debug("Cache miss for url {}, fetching from DB", shortUrl);
            mapping = urlRepository.findByShortUrl(shortUrl);
            if (mapping != null) {
                redisTemplate.opsForValue().set(redisKey, mapping, Duration.ofHours(24));
            }
        }

        if (mapping != null) {
            longUrl = mapping.getLongUrl();

            ClickEvent event = new ClickEvent(
                    shortUrl,
                    mapping.getUserId(),
                    mapping.getUrlName(),
                    request.getRemoteAddr(),
                    System.currentTimeMillis()
            );

            clickEventQueue.offer(event);
        }

        return longUrl;
    }
}

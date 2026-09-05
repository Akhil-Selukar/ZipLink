package com.ziplink.url_service.service;

import com.ziplink.url_service.channel.UserServiceChannel;
import com.ziplink.url_service.dto.UrlRequestDTO;
import com.ziplink.url_service.entity.UrlMappingEntity;
import com.ziplink.url_service.repository.UrlRepository;
import com.ziplink.url_service.util.Base62Encoder;
import com.ziplink.url_service.util.SnowflakeIdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UrlService {
    private static final Logger logger = LoggerFactory.getLogger(UrlService.class);

    private final UrlRepository urlRepository;
    private final UserServiceChannel userServiceChannel;
    private final SnowflakeIdGenerator idGenerator;
    private final Base62Encoder encoder;

    public UrlService(UrlRepository urlRepository, UserServiceChannel userServiceChannel, Base62Encoder encoder, SnowflakeIdGenerator idGenerator) {
        this.urlRepository = urlRepository;
        this.userServiceChannel = userServiceChannel;
        this.encoder = encoder;
        this.idGenerator = idGenerator;
    }

    public String transformUrl(UrlRequestDTO requestDTO, String userEmail) {
        logger.debug("Processing url transformation");
        long uniqueId = idGenerator.generate();
        String base62Encoded = encoder.encode(uniqueId);

        UrlMappingEntity urlMapping = new UrlMappingEntity();
        urlMapping.setLongUrl(requestDTO.getLongUrl());
        urlMapping.setShortUrl(base62Encoded);
        urlMapping.setUrlName(requestDTO.getUrlName());
        urlMapping.setUser(userServiceChannel.fetchUserId(userEmail));

        logger.debug("Saving url mapping");
        UrlMappingEntity savedMapping = urlRepository.save(urlMapping);
        return savedMapping.getShortUrl();
    }

    public List<String[]> getAllUrls(String userEmail) {
        long userId = userServiceChannel.fetchUserId(userEmail);
        List<String[]> urls = new ArrayList<>();

        List<UrlMappingEntity> result = urlRepository.findByUserId(userId);

        for(UrlMappingEntity entity:result){
            urls.add(new String[] {entity.getUrlName(), entity.getShortUrl()});
        }

        return urls;
    }

    @Transactional
    public long deleteUrl(String shortUrl) {
        return urlRepository.deleteByShortUrl(shortUrl);
    }
}

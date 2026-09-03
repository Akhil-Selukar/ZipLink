package com.ziplink.url_service.repository;

import com.ziplink.url_service.entity.UrlMappingEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UrlRepository extends CrudRepository<UrlMappingEntity, Long> {
    List<UrlMappingEntity> findByUserId(long userId);

    long deleteByShortUrl(String shortUrl);
}

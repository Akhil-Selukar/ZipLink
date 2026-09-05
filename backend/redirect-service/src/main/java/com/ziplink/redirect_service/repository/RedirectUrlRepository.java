package com.ziplink.redirect_service.repository;

import com.ziplink.redirect_service.entity.UrlMappingEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RedirectUrlRepository extends CrudRepository<UrlMappingEntity, Long> {
    UrlMappingEntity findByShortUrl(String shortUrl);
}

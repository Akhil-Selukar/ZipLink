package com.ziplink.analytics_service.repository;

import com.ziplink.analytics_service.entity.EventEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends CrudRepository<EventEntity, Long> {
    @Query(value = """
        SELECT url_name AS urlName, short_url as shortUrl, COUNT(id) AS count
        FROM click_events
        WHERE user_id = :userId
        GROUP BY url_name;
        """, nativeQuery = true)
    List<ClickCountProjection> getClickCountsByUserId(@Param("userId") Long userId);

    long deleteByShortUrl(String shortUrl);
}

package com.ziplink.analytics_service.repository;

public interface ClickCountProjection {
    String getUrlName();
    String getShortUrl();
    Long getCount();
}

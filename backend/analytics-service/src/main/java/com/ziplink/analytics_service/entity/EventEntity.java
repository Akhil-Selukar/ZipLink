package com.ziplink.analytics_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "click_events")
public class EventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "short_url")
    private String shortUrl;
    @Column(name = "ip")
    private String ip;
    @Column(name = "time_stamp")
    private long timestamp;

    @Column(name = "url_name")
    private String urlName;

    @Column(name = "user_id", nullable = false)
    private long userId;

    public EventEntity(){};

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getUrlName() {
        return urlName;
    }

    public void setUrlName(String urlName) {
        this.urlName = urlName;
    }
}

package com.ziplink.url_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "url_mapping", uniqueConstraints = {@UniqueConstraint(columnNames = "short_url")})
public class UrlMappingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "short_url")
    private String shortUrl;
    @Column(name = "long_url")
    private String longUrl;

    @Column(name = "url_name")
    private String urlName;

    @Column(name = "user_id", nullable = false)
    private long userId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }

    public long getUser() {
        return userId;
    }

    public void setUser(long userId) {
        this.userId = userId;
    }

    public String getUrlName() {
        return urlName;
    }

    public void setUrlName(String urlName) {
        this.urlName = urlName;
    }
}

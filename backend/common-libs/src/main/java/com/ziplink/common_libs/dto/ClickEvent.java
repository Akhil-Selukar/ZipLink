package com.ziplink.common_libs.dto;

public class ClickEvent {
    private String shortUrl;
    private String ip;
    private long timestamp;
    private String urlName;
    private long userId;

    public ClickEvent(){};
    public ClickEvent(String shortUrl, long userId, String urlName, String ip, long timestamp) {
        this.shortUrl = shortUrl;
        this.urlName = urlName;
        this.ip = ip;
        this.timestamp = timestamp;
        this.userId = userId;
    }

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

    @Override
    public String toString() {
        return "ClickEvent{" +
                "shortUrl='" + shortUrl + '\'' +
                ", ip='" + ip + '\'' +
                ", timestamp=" + timestamp +
                ", userId=" + userId +
                '}';
    }
}

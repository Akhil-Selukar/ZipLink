package com.ziplink.analytics_service.dto;

public class AnalyticResponseDTO {
    private String urlName;
    private String shortUrl;
    private long count;

    public AnalyticResponseDTO(String urlName, String shortUrl, long count) {
        this.urlName = urlName;
        this.shortUrl = shortUrl;
        this.count = count;
    }

    public String getUrlName() {
        return urlName;
    }

    public void setUrlName(String urlName) {
        this.urlName = urlName;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}

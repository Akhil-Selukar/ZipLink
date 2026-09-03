package com.ziplink.url_service.dto;

import jakarta.validation.constraints.NotBlank;

public class UrlRequestDTO {
    @NotBlank(message = "Url to transform must be provided.")
    private String longUrl;
    private String urlName;

    public UrlRequestDTO(String longUrl, String urlName) {
        this.longUrl = longUrl;
        this.urlName = urlName;
//        this.userId = userId;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }

    public String getUrlName() {
        return urlName;
    }

    public void setUrlName(String urlName) {
        this.urlName = urlName;
    }
}

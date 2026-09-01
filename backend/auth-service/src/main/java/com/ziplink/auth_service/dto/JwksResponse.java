package com.ziplink.auth_service.dto;

import java.util.List;

public class JwksResponse {
    private List<JwkKey> keys;

    public JwksResponse(List<JwkKey> keys) {
        this.keys = keys;
    }

    public List<JwkKey> getKeys() {
        return keys;
    }

    public void setKeys(List<JwkKey> keys) {
        this.keys = keys;
    }
}

package com.ziplink.url_service.util;

import org.springframework.stereotype.Component;

@Component
public class Base62Encoder {
    private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    public String encode(long value) {
        StringBuilder sb = new StringBuilder();

        while (value > 0) {
            int index = (int) (value % 62);
            sb.append(BASE62.charAt(index));
            value /= 62;
        }

        return sb.reverse().toString();
    }
}

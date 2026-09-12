package com.ziplink.redirect_service.controller;

import com.ziplink.redirect_service.service.RedirectService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/r")
public class RedirectController {
    private static final Logger logger = LoggerFactory.getLogger(RedirectController.class);
    @Autowired
    private RedirectService redirectService;

    @GetMapping("/{shortUrl}")
    public ResponseEntity<String> redirect(@PathVariable String shortUrl, HttpServletRequest request){
        logger.debug("Redirect request received for {}", shortUrl);
        String longUrl = redirectService.getUrlMapping(shortUrl, request);
        if (longUrl == null) {
            logger.debug("Mapping not found for url {}", shortUrl);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Mapping not found for provided url");
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, longUrl)
                .build();
    }
}

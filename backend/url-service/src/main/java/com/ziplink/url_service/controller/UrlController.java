package com.ziplink.url_service.controller;

import com.ziplink.url_service.dto.UrlRequestDTO;
import com.ziplink.url_service.service.UrlService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/url")
public class UrlController {
    private static final Logger logger = LoggerFactory.getLogger(UrlController.class);
    @Value("${app.base-url}")
    private String baseUrl;
    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> transformUrl(@Valid @RequestBody UrlRequestDTO requestDTO, @RequestHeader("X-User-Email") String userEmail){
        logger.debug("Url transformation request received");
        String shortUrl = urlService.transformUrl(requestDTO, userEmail);
        logger.debug("Url transformation completed");

        Map<String, String> response = new HashMap<>();
        response.put("shortUrl", baseUrl+"/"+shortUrl);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<String[]>> getAllUrlsByUser(@RequestHeader("X-User-Email") String userEmail){
        logger.debug("Fetch all Url request received for user {}",userEmail);
        List<String[]> urls = urlService.getAllUrls(userEmail);

        return ResponseEntity.status(HttpStatus.OK)
                .body(urls);
    }

    @DeleteMapping("/delete/{shortUrl}")
    public ResponseEntity<Long> deleteUrl(@PathVariable String shortUrl, @RequestHeader("X-User-Email") String userEmail){
        logger.debug("Deleting url {} from user {}", shortUrl, userEmail);
        long recordsDeleted = urlService.deleteUrl(shortUrl);

        return ResponseEntity.status(HttpStatus.OK)
                .body(recordsDeleted);
    }
}

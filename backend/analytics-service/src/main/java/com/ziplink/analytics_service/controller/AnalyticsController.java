package com.ziplink.analytics_service.controller;

import com.ziplink.analytics_service.dto.AnalyticResponseDTO;
import com.ziplink.analytics_service.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/analytics")
public class AnalyticsController {
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<List<AnalyticResponseDTO>> getAnalyticsByUserEmail(@RequestHeader("X-User-Email") String userEmail){

        List<AnalyticResponseDTO> details = analyticsService.getAnalyticsByUserEmail(userEmail);

        return ResponseEntity.status(HttpStatus.OK)
                .body(details);
    }

    @DeleteMapping("/delete/{shortUrl}")
    public ResponseEntity<Long> deleteAnalyticsById(@PathVariable("shortUrl") String shortUrl){

        long entriesDeleted = analyticsService.deleteAnalyticsByShortUrl(shortUrl);

        return ResponseEntity.status(HttpStatus.OK)
                .body(entriesDeleted);
    }
}

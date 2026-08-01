package com.localloop.controller;

import com.localloop.dto.ProviderResponse;
import com.localloop.service.ServiceMarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceMarketplaceService serviceMarketplaceService;

    // Public Route: GET /api/services
    @GetMapping
    public ResponseEntity<List<ProviderResponse>> getAllServices() {
        return ResponseEntity.ok(serviceMarketplaceService.getAllServiceProviders());
    }
}
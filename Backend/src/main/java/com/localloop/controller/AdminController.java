package com.localloop.controller;

import com.localloop.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ==========================================
    // OVERVIEW & STATS
    // ==========================================
    
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // ==========================================
    // USER MANAGEMENT
    // ==========================================
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> updates) {
        
        // Updates can include "role", "fullName", "email", or "status"
        return ResponseEntity.ok(adminService.updateUser(id, updates));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User completely removed from platform"));
    }

    // ==========================================
    // COMMUNITY MANAGEMENT
    // ==========================================
    
    @GetMapping("/communities")
    public ResponseEntity<?> getAllCommunities() {
        return ResponseEntity.ok(adminService.getAllCommunities());
    }

    @PutMapping("/communities/{id}")
    public ResponseEntity<?> updateCommunity(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> updates) {
        
        // Updates can include "name", "location", etc.
        return ResponseEntity.ok(adminService.updateCommunity(id, updates));
    }

    @DeleteMapping("/communities/{id}")
    public ResponseEntity<?> deleteCommunity(@PathVariable Long id) {
        adminService.deleteCommunity(id);
        return ResponseEntity.ok(Map.of("message", "Community and all associated data deleted"));
    }

    // ==========================================
    // LISTING MANAGEMENT
    // ==========================================
    
    @GetMapping("/listings")
    public ResponseEntity<?> getAllListings() {
        return ResponseEntity.ok(adminService.getAllListings());
    }

    @PutMapping("/listings/{id}")
    public ResponseEntity<?> updateListing(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> updates) {
        
        // Admin overrides (e.g., forcing status to "hidden" or editing inappropriate titles)
        return ResponseEntity.ok(adminService.updateListingAsAdmin(id, updates));
    }

    @DeleteMapping("/listings/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id) {
        // We use a specific admin delete method to bypass the "must be owner" checks
        adminService.deleteListingAsAdmin(id);
        return ResponseEntity.ok(Map.of("message", "Listing deleted by Admin"));
    }
    
    // ==========================================
    // PROVIDER APPROVALS (If applicable)
    // ==========================================
    
    @GetMapping("/providers/pending")
    public ResponseEntity<?> getPendingProviders() {
        return ResponseEntity.ok(adminService.getPendingProviders());
    }
    
    @PutMapping("/providers/{id}/status")
    public ResponseEntity<?> updateProviderStatus(
            @PathVariable Long id, 
            @RequestParam String status) { // "APPROVED" or "REJECTED"
        
        return ResponseEntity.ok(adminService.updateProviderStatus(id, status));
    }
}
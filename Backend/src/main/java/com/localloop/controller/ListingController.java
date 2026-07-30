package com.localloop.controller;

import com.localloop.dto.ListingRequest;
import com.localloop.dto.ListingResponse;
import com.localloop.entity.User;
import com.localloop.repository.UserRepository;
import com.localloop.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;
    private final UserRepository userRepository; // Injected to safely fetch the user ID

    // ==========================================
    // HELPER: Safely get the real User ID
    // ==========================================
    private Long getCurrentUserId(Authentication authentication) {
        String email = authentication.getName(); // Extracts the email from your JWT token
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found in database"));
        return user.getId();
    }

    // ==========================================
    // ENDPOINTS
    // ==========================================


    @GetMapping("/my-listings")
    public ResponseEntity<List<ListingResponse>> getMyListings(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        return ResponseEntity.ok(listingService.getMyListings(userId));
    }
    @GetMapping
public ResponseEntity<List<ListingResponse>> getAllListings(Authentication authentication) {

    System.out.println("Controller reached");

    if (authentication == null) {
        System.out.println("Authentication is NULL");
    } else {
        System.out.println("Authentication name = " + authentication.getName());
        System.out.println("Authorities = " + authentication.getAuthorities());
    }

    Long userId = getCurrentUserId(authentication);
    return ResponseEntity.ok(listingService.getAllActiveListings(userId));
}
@PostMapping
    public ResponseEntity<ListingResponse> createListing(
            Authentication authentication,
            @RequestBody ListingRequest request) { // <-- Back to simple JSON!
        
        Long userId = getCurrentUserId(authentication);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(listingService.createListing(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateListing(
            @PathVariable Long id, 
            Authentication authentication,
            @RequestBody ListingRequest request) { // <-- Back to simple JSON!
        try {
            Long userId = getCurrentUserId(authentication);
            return ResponseEntity.ok(listingService.updateListing(id, userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id, Authentication authentication) {
        // We can just pass the email string directly to your existing service method
        listingService.deleteListing(id, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
package com.localloop.service;

import com.localloop.dto.ListingRequest;
import com.localloop.dto.ListingResponse;
import com.localloop.entity.Listing;
import com.localloop.entity.User;
import com.localloop.repository.ListingRepository;
import com.localloop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    // Helper method to map Entity to DTO
    private ListingResponse mapToResponse(Listing listing) {
        ListingResponse response = new ListingResponse();
        response.setId(listing.getId());
        response.setUserId(listing.getUser().getId());
        response.setTitle(listing.getTitle());
        response.setDescription(listing.getDescription());
        response.setPrice(listing.getPrice());
        response.setImageUrl(listing.getImageUrl());
        response.setStatus(listing.getStatus());
        response.setCreatedAt(listing.getCreatedAt());
        
        // Map joined user fields safely
        if (listing.getUser() != null) {
            response.setFullName(listing.getUser().getFullName());
            response.setReputationScore(listing.getUser().getReputationScore());
        }
        
        return response;
    }

    public ListingResponse createListing(Long userId, ListingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Listing listing = new Listing();
        listing.setUser(user);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setImageUrl(request.getImageUrl()); // Just save the string directly!
        listing.setStatus("active");

        Listing savedListing = listingRepository.save(listing);
        return mapToResponse(savedListing);
    }

    public List<ListingResponse> getAllActiveListings(Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Safeguard in case user hasn't joined a community yet
        if (user.getCommunity() == null) {
            return List.of(); 
        }
        
        Long communityId = user.getCommunity().getId();

        List<Listing> listings = listingRepository.findByStatusAndUserCommunityIdAndUserIdNotOrderByCreatedAtDesc(
                "active", communityId, currentUserId);
                
        return listings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ListingResponse> getMyListings(Long currentUserId) {
        List<Listing> listings = listingRepository.findByUserIdOrderByCreatedAtDesc(currentUserId);
        return listings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ListingResponse updateListing(Long listingId, Long userId, ListingRequest request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to edit this listing");
        }

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setImageUrl(request.getImageUrl()); // Just save the string directly!
        
        if (request.getStatus() != null) {
            listing.setStatus(request.getStatus());
        }

        Listing updatedListing = listingRepository.save(listing);
        return mapToResponse(updatedListing);
    }

    public void deleteListing(Long id, String email) {
        Listing listing = listingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Listing not found"));
        
        // Verify ownership via email
        if (!listing.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to delete this listing");
        }
        
        listingRepository.delete(listing);
    }
}
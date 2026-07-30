package com.localloop.service;

import com.localloop.entity.Community;
import com.localloop.entity.Listing;
import com.localloop.entity.User;
import com.localloop.repository.CommunityRepository;
import com.localloop.repository.ListingRepository;
import com.localloop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final ListingRepository listingRepository;

    // ==========================================
    // 1. PLATFORM ANALYTICS
    // ==========================================
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCommunities", communityRepository.count());
        stats.put("activeListings", listingRepository.count()); 
        
        // Assuming you track pending providers via a role or status field. 
        // Update this to match your specific User entity property!
        // stats.put("pendingProviders", userRepository.countByRole("PENDING_PROVIDER")); 
        stats.put("pendingProviders", 0); // Placeholder until custom repo method is added

        return stats;
    }

    // ==========================================
    // 2 & 3. EDIT / DELETE USER
    // ==========================================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, Map<String, Object> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Dynamically update only the fields that were sent in the request
        if (updates.containsKey("fullName")) {
            user.setFullName((String) updates.get("fullName"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("role")) {
            // Assuming your User entity stores roles as Strings. 
            // If using Enums, parse it here: Role.valueOf((String) updates.get("role"))
            // user.setRole((String) updates.get("role"));
        }
        
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    // ==========================================
    // 4 & 5. EDIT / DELETE COMMUNITY
    // ==========================================
    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Community updateCommunity(Long id, Map<String, Object> updates) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        if (updates.containsKey("name")) {
            community.setName((String) updates.get("name"));
        }
        
        // Use the actual fields defined in your Community.java entity
        if (updates.containsKey("city")) {
            community.setCity((String) updates.get("city"));
        }
        if (updates.containsKey("state")) {
            community.setState((String) updates.get("state"));
        }
        if (updates.containsKey("pincode")) {
            community.setPincode((String) updates.get("pincode"));
        }

        return communityRepository.save(community);
    }

    public void deleteCommunity(Long id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Community not found"));
        communityRepository.delete(community);
    }

    // ==========================================
    // 6 & 7. EDIT / DELETE LISTING (Admin Override)
    // ==========================================
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }

    public Listing updateListingAsAdmin(Long id, Map<String, Object> updates) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (updates.containsKey("title")) {
            listing.setTitle((String) updates.get("title"));
        }
        if (updates.containsKey("description")) {
            listing.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("status")) {
            listing.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("price")) {
            // Safely convert Number to BigDecimal
            Object priceObj = updates.get("price");
            if (priceObj instanceof Number) {
                listing.setPrice(BigDecimal.valueOf(((Number) priceObj).doubleValue()));
            } else if (priceObj instanceof String) {
                listing.setPrice(new BigDecimal((String) priceObj));
            }
        }

        return listingRepository.save(listing);
    }

    public void deleteListingAsAdmin(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        listingRepository.delete(listing);
    }

    // ==========================================
    // 8. APPROVE / REJECT SERVICE PROVIDERS
    // ==========================================
    public List<User> getPendingProviders() {
        // You will need to add this method to your UserRepository:
        // return userRepository.findByRole("PENDING_PROVIDER");
        throw new RuntimeException("Method requires custom repository query to find pending providers.");
    }

    public User updateProviderStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (status.equalsIgnoreCase("APPROVED")) {
            // Update the user's role to grant them provider privileges
            // user.setRole("SERVICE_PROVIDER");
        } else if (status.equalsIgnoreCase("REJECTED")) {
            // Revert them to a standard user or mark as rejected
            // user.setRole("USER");
        }

        return userRepository.save(user);
    }
}
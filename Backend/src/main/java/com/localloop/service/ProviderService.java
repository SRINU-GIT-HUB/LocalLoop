package com.localloop.service;
import java.math.BigDecimal;
import com.localloop.dto.UpdateProfileRequest;
import com.localloop.entity.User;
import com.localloop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final UserRepository userRepository;

    // Fetch a public provider profile (Replicates Node.js getProviderProfile)
    public User getProviderProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        if (!user.getIsProvider()) {
            throw new RuntimeException("User is not an active provider");
        }
        return user;
    }

    // Update logged-in user's profile (Replicates Node.js updateProviderProfile)
    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update provider toggle and fields
        user.setIsProvider(request.getIsProvider() != null ? request.getIsProvider() : false);
        user.setServiceCategory(request.getServiceCategory());
        user.setProviderTitle(request.getProviderTitle());
        user.setExperienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 0);
        user.setHourlyRate(request.getHourlyRate() != null ? request.getHourlyRate() : BigDecimal.ZERO);
        user.setAvailability(request.getAvailability());
        user.setProviderDescription(request.getProviderDescription());
        user.setProfilePhoto(request.getProfilePhoto());
        user.setSkills(request.getSkills());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setLocation(request.getLocation());

        // Save and return the updated user to be sent back to React Context
        return userRepository.save(user);
    }
}
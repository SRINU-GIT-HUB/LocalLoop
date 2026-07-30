package com.localloop.service;

import com.localloop.dto.ProviderResponse;
import com.localloop.entity.User;
import com.localloop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceMarketplaceService {

    private final UserRepository userRepository;

    private ProviderResponse mapToResponse(User user) {
        ProviderResponse response = new ProviderResponse();
        
        response.setProviderId(user.getId());
        response.setProviderName(user.getFullName());
        response.setProfilePhoto(user.getProfilePhoto());
        response.setProviderTitle(user.getProviderTitle());
        response.setServiceCategory(user.getServiceCategory());
        response.setExperienceYears(user.getExperienceYears());
        response.setHourlyRate(user.getHourlyRate());
        response.setAverageRating(user.getAverageRating());
        response.setCompletedJobs(user.getCompletedJobs());
        response.setAvailability(user.getAvailability());
        response.setProviderDescription(user.getProviderDescription());
        response.setTotalReviews(user.getTotalReviews());
        response.setLocation(user.getLocation());
        response.setSkills(user.getSkills());
        
        return response;
    }

    public List<ProviderResponse> getAllServiceProviders() {
        // Fetch all active providers sorted by newest first
        List<User> providers = userRepository.findByIsProviderTrueOrderByCreatedAtDesc();
        
        // Map the entities to DTOs for the frontend
        return providers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
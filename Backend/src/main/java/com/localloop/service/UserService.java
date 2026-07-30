package com.localloop.service;

import com.localloop.entity.ProviderStatus;
import com.localloop.entity.User;
import com.localloop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public void applyForProvider(String email, String category, String description, int experience) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setServiceCategory(category);
        user.setProviderDescription(description);
        user.setExperienceYears(experience);
        user.setProviderStatus(ProviderStatus.PENDING);
        userRepository.save(user);
    }
}
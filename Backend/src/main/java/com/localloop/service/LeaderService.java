package com.localloop.service;

import com.localloop.entity.ProviderStatus;
import com.localloop.entity.Role;
import com.localloop.entity.User;
import com.localloop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderService {
    
    private final UserRepository userRepository;

    public List<User> getPendingProvidersForLeader(String leaderEmail) {
        User leader = userRepository.findByEmail(leaderEmail)
            .orElseThrow(() -> new RuntimeException("Leader not found"));
        
        if (leader.getCommunity() == null) {
            throw new RuntimeException("Leader is not assigned to any community");
        }
        
        // Fetch only users in this leader's community with PENDING status
        return userRepository.findByCommunityIdAndProviderStatus(
            leader.getCommunity().getId(), 
            ProviderStatus.PENDING
        );
    }

    public void approveProvider(Long userId, String leaderEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setProviderStatus(ProviderStatus.APPROVED);
        user.setIsProvider(true);
        // Change this line in approveProvider:
        user.setRole(Role.SERVICE_PROVIDER);
        userRepository.save(user);
    }

    public void rejectProvider(Long userId, String reason, String leaderEmail) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setProviderStatus(ProviderStatus.REJECTED);
        user.setRejectionReason(reason);
        userRepository.save(user);
    }
}
package com.localloop.repository;
import com.localloop.entity.ProviderStatus;
import com.localloop.entity.Role;
import com.localloop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByIsProviderTrueOrderByCreatedAtDesc();

    // Fetch providers ONLY within the user's community
List<User> findByRoleAndCommunityIdOrderByCreatedAtDesc(Role role, Long communityId);

// For the Leader Dashboard
List<User> findByCommunityIdAndProviderStatusOrderByCreatedAtDesc(Long communityId, ProviderStatus status);
long countByProviderStatus(ProviderStatus status);
List<User> findByCommunityIdAndProviderStatus(Long communityId, ProviderStatus providerStatus);
}
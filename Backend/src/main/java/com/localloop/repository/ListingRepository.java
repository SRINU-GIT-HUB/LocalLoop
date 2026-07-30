package com.localloop.repository;
import com.localloop.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    // Replaces the old method to enforce Community Isolation
List<Listing> findByStatusAndUserCommunityIdAndUserIdNotOrderByCreatedAtDesc(
    String status, Long communityId, Long currentUserId
);
    List<Listing> findByUserIdOrderByCreatedAtDesc(Long userId);
}
package com.localloop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "users")

public class User {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "reputation_score")
    private Integer reputationScore = 0;

    // --- Service Provider Fields ---
    @Column(name = "is_provider")
    private Boolean isProvider = false;
    
    @Column(name = "service_category")
    private String serviceCategory;
    
    @Column(name = "provider_title")
    private String providerTitle;
    
    @Column(name = "experience_years")
    private Integer experienceYears = 0;
    
    @Column(name = "completed_jobs")
    private Integer completedJobs = 0;
    
    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate = BigDecimal.ZERO;
    
    @Column(name = "provider_description", columnDefinition = "TEXT")
    private String providerDescription;
    
    private String availability = "Available";
    
    @Column(name = "average_rating")
    private BigDecimal averageRating = BigDecimal.ZERO;
    
    @Column(name = "total_reviews")
    private Integer totalReviews = 0;
    
    @Column(name = "profile_photo")
    private String profilePhoto;
    
    private String skills;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    private String location;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider_status")
    private ProviderStatus providerStatus = ProviderStatus.NONE;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id")
    private Community community; // Users are strictly bound to one community

    @Column(name = "rejection_reason")
    private String rejectionReason;
}
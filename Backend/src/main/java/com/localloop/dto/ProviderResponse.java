package com.localloop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProviderResponse {
    
    @JsonProperty("provider_id")
    private Long providerId;

    @JsonProperty("provider_name")
    private String providerName;

    @JsonProperty("profile_photo")
    private String profilePhoto;

    @JsonProperty("provider_title")
    private String providerTitle;

    @JsonProperty("service_category")
    private String serviceCategory;

    @JsonProperty("experience_years")
    private Integer experienceYears;

    @JsonProperty("hourly_rate")
    private BigDecimal hourlyRate;

    @JsonProperty("average_rating")
    private BigDecimal averageRating;

    @JsonProperty("completed_jobs")
    private Integer completedJobs;

    private String availability;

    @JsonProperty("provider_description")
    private String providerDescription;

    @JsonProperty("total_reviews")
    private Integer totalReviews;

    private String location;
    
    private String skills;
}
package com.localloop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateProfileRequest {
    private String fullName;

    @JsonProperty("is_provider")
    private Boolean isProvider;

    @JsonProperty("service_category")
    private String serviceCategory;

    @JsonProperty("provider_title")
    private String providerTitle;

    @JsonProperty("experience_years")
    private Integer experienceYears;

    @JsonProperty("hourly_rate")
    private BigDecimal hourlyRate;

    private String availability;

    @JsonProperty("provider_description")
    private String providerDescription;

    @JsonProperty("profile_photo")
    private String profilePhoto;

    private String skills;

    @JsonProperty("phone_number")
    private String phoneNumber;

    private String location;
}
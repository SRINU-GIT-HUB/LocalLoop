package com.localloop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Full name cannot be blank")
    @JsonProperty("fullName")
    private String fullName;
    
    @NotBlank(message = "Email cannot be blank")
    @JsonProperty("email")
    private String email;
    
    @NotBlank(message = "Password cannot be blank")
    @JsonProperty("password")
    private String password;
    
    // Explicitly mapping the community toggle
    @JsonProperty("isCreatingCommunity")
    private Boolean isCreatingCommunity;
    
    @JsonProperty("joinCommunityId")
    private Long joinCommunityId;
    
    @JsonProperty("communityName")
    private String communityName;
    
    @JsonProperty("city")
    private String city;
    
    @JsonProperty("state")
    private String state;
    
    @JsonProperty("pincode")
    private String pincode;
}
package com.localloop.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ListingResponse {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;
    
    // User specific details
    private String fullName;
    private Integer reputationScore;
}
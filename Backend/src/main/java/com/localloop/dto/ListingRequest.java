package com.localloop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ListingRequest {
    private String title;
    private String description;
    private BigDecimal price;
    private String imageUrl; // The user will just paste a link here!
    private String status;
}
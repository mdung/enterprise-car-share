package com.enterprise.carshare.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckinRequest {
    
    @NotNull(message = "End mileage is required")
    @PositiveOrZero(message = "End mileage must be positive or zero")
    private Long endMileage;
    
    @NotNull(message = "End fuel level is required")
    private BigDecimal endFuelLevel;
    
    private Boolean damageReported;
    private String damageDescription;
    private String[] postTripPhotos;
    private String checkinComments;
}


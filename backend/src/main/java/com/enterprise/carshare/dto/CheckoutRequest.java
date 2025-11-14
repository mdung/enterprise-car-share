package com.enterprise.carshare.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckoutRequest {
    
    @NotNull(message = "Start mileage is required")
    @PositiveOrZero(message = "Start mileage must be positive or zero")
    private Long startMileage;
    
    @NotNull(message = "Start fuel level is required")
    private BigDecimal startFuelLevel;
    
    private String[] preTripPhotos;
    private String checkoutComments;
}


package com.enterprise.carshare.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingCreateRequest {
    
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;
    
    @NotNull(message = "Start date time is required")
    @Future(message = "Start date time must be in the future")
    private LocalDateTime startDateTime;
    
    @NotNull(message = "End date time is required")
    @Future(message = "End date time must be in the future")
    private LocalDateTime endDateTime;
    
    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;
    
    @NotBlank(message = "Return location is required")
    private String returnLocation;
    
    private String purpose;
}


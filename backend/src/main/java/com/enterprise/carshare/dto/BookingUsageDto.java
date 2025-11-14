package com.enterprise.carshare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingUsageDto {
    private Long id;
    private Long bookingId;
    private Long startMileage;
    private Long endMileage;
    private BigDecimal startFuelLevel;
    private BigDecimal endFuelLevel;
    private Long distanceTravelled;
    private Boolean damageReported;
    private String damageDescription;
    private String[] preTripPhotos;
    private String[] postTripPhotos;
    private String checkoutComments;
    private String checkinComments;
    private LocalDateTime checkedOutAt;
    private LocalDateTime checkedInAt;
}


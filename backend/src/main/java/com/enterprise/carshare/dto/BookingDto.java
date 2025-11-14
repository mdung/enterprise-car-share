package com.enterprise.carshare.dto;

import com.enterprise.carshare.domain.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private Long id;
    private Long vehicleId;
    private VehicleDto vehicle;
    private Long userId;
    private String userEmail;
    private String userName;
    private Long approverId;
    private String approverEmail;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private String pickupLocation;
    private String returnLocation;
    private String purpose;
    private Booking.BookingStatus status;
    private Boolean approvalRequired;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BookingUsageDto usage;
}


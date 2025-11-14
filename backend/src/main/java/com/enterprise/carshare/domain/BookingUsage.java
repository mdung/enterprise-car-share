package com.enterprise.carshare.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_usage")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class BookingUsage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;
    
    @Column(name = "start_mileage")
    private Long startMileage;
    
    @Column(name = "end_mileage")
    private Long endMileage;
    
    @Column(name = "start_fuel_level", precision = 5, scale = 2)
    private BigDecimal startFuelLevel;
    
    @Column(name = "end_fuel_level", precision = 5, scale = 2)
    private BigDecimal endFuelLevel;
    
    @Column(name = "distance_travelled")
    private Long distanceTravelled;
    
    @Column(name = "damage_reported", nullable = false)
    @Builder.Default
    private Boolean damageReported = false;
    
    @Column(name = "damage_description", columnDefinition = "TEXT")
    private String damageDescription;
    
    @Column(name = "pre_trip_photos", columnDefinition = "TEXT[]")
    private String[] preTripPhotos;
    
    @Column(name = "post_trip_photos", columnDefinition = "TEXT[]")
    private String[] postTripPhotos;
    
    @Column(name = "checkout_comments", columnDefinition = "TEXT")
    private String checkoutComments;
    
    @Column(name = "checkin_comments", columnDefinition = "TEXT")
    private String checkinComments;
    
    @Column(name = "checked_out_at")
    private LocalDateTime checkedOutAt;
    
    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}


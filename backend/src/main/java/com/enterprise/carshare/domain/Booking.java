package com.enterprise.carshare.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;
    
    @Column(name = "start_date_time", nullable = false)
    private LocalDateTime startDateTime;
    
    @Column(name = "end_date_time", nullable = false)
    private LocalDateTime endDateTime;
    
    @Column(name = "pickup_location", nullable = false)
    private String pickupLocation;
    
    @Column(name = "return_location", nullable = false)
    private String returnLocation;
    
    @Column(columnDefinition = "TEXT")
    private String purpose;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(name = "approval_required", nullable = false)
    @Builder.Default
    private Boolean approvalRequired = false;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private BookingUsage usage;
    
    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED
    }
}


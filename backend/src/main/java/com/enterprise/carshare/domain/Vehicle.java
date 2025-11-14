package com.enterprise.carshare.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "plate_number", unique = true, nullable = false)
    private String plateNumber;
    
    @Column(nullable = false)
    private String brand;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private Integer year;
    
    private String color;
    
    @Column(name = "vehicle_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;
    
    @Column(name = "fuel_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private FuelType fuelType;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(unique = true)
    private String vin;
    
    @Column(name = "department_owner")
    private String departmentOwner;
    
    @Column(name = "cost_center")
    private String costCenter;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;
    
    @Column(name = "current_mileage", nullable = false)
    @Builder.Default
    private Long currentMileage = 0L;
    
    @Column(name = "last_service_date")
    private LocalDate lastServiceDate;
    
    @Column(name = "next_service_due")
    private LocalDate nextServiceDue;
    
    @Column(name = "insurance_expiry_date")
    private LocalDate insuranceExpiryDate;
    
    @Column(name = "registration_expiry_date")
    private LocalDate registrationExpiryDate;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    public enum VehicleType {
        CAR, VAN, TRUCK
    }
    
    public enum FuelType {
        PETROL, DIESEL, ELECTRIC, HYBRID
    }
    
    public enum VehicleStatus {
        AVAILABLE, IN_USE, MAINTENANCE, INACTIVE
    }
}


package com.enterprise.carshare.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePhoto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @Column(name = "photo_path", nullable = false)
    private String photoPath;
    
    @Column(name = "photo_type")
    @Enumerated(EnumType.STRING)
    private PhotoType photoType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
    
    public enum PhotoType {
        EXTERIOR, INTERIOR, DAMAGE, OTHER
    }
}


package com.enterprise.carshare.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @Column(name = "document_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;
    
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;
    
    public enum DocumentType {
        REGISTRATION, INSURANCE, INSPECTION, OTHER
    }
}


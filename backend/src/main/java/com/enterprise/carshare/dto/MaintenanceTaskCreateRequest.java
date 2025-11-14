package com.enterprise.carshare.dto;

import com.enterprise.carshare.domain.MaintenanceTask;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MaintenanceTaskCreateRequest {
    
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private MaintenanceTask.MaintenanceStatus status;
    
    private LocalDate plannedDate;
    
    private BigDecimal cost;
    
    private String workshopName;
}


package com.enterprise.carshare.dto;

import com.enterprise.carshare.domain.MaintenanceTask;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceTaskDto {
    private Long id;
    private Long vehicleId;
    private VehicleDto vehicle;
    private Long createdById;
    private String createdByEmail;
    private String title;
    private String description;
    private MaintenanceTask.MaintenanceStatus status;
    private LocalDate plannedDate;
    private LocalDate completedDate;
    private BigDecimal cost;
    private String workshopName;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}


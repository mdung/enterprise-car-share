package com.enterprise.carshare.dto;

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
public class ReportDto {
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private Long totalBookings;
    private Long totalDistance;
    private BigDecimal estimatedFuelUsage;
    private Long totalVehicles;
    private Long activeVehicles;
    private Long vehiclesInMaintenance;
}


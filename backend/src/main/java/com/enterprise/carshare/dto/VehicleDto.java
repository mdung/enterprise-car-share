package com.enterprise.carshare.dto;

import com.enterprise.carshare.domain.Vehicle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {
    private Long id;
    private String plateNumber;
    private String brand;
    private String model;
    private Integer year;
    private String color;
    private Vehicle.VehicleType vehicleType;
    private Vehicle.FuelType fuelType;
    private Integer capacity;
    private String vin;
    private String departmentOwner;
    private String costCenter;
    private Vehicle.VehicleStatus status;
    private Long currentMileage;
    private LocalDate lastServiceDate;
    private LocalDate nextServiceDue;
    private LocalDate insuranceExpiryDate;
    private LocalDate registrationExpiryDate;
}


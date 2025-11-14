package com.enterprise.carshare.dto;

import com.enterprise.carshare.domain.Vehicle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class VehicleCreateRequest {
    
    @NotBlank(message = "Plate number is required")
    private String plateNumber;
    
    @NotBlank(message = "Brand is required")
    private String brand;
    
    @NotBlank(message = "Model is required")
    private String model;
    
    @NotNull(message = "Year is required")
    @Positive(message = "Year must be positive")
    private Integer year;
    
    private String color;
    
    @NotNull(message = "Vehicle type is required")
    private Vehicle.VehicleType vehicleType;
    
    @NotNull(message = "Fuel type is required")
    private Vehicle.FuelType fuelType;
    
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;
    
    private String vin;
    private String departmentOwner;
    private String costCenter;
    private LocalDate lastServiceDate;
    private LocalDate nextServiceDue;
    private LocalDate insuranceExpiryDate;
    private LocalDate registrationExpiryDate;
}


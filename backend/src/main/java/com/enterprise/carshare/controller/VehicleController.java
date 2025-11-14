package com.enterprise.carshare.controller;

import com.enterprise.carshare.domain.Vehicle;
import com.enterprise.carshare.dto.PageResponse;
import com.enterprise.carshare.dto.VehicleCreateRequest;
import com.enterprise.carshare.dto.VehicleDto;
import com.enterprise.carshare.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicles", description = "Vehicle management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class VehicleController {
    
    private final VehicleService vehicleService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new vehicle")
    public ResponseEntity<VehicleDto> createVehicle(@Valid @RequestBody VehicleCreateRequest request) {
        VehicleDto vehicle = vehicleService.createVehicle(request);
        return ResponseEntity.ok(vehicle);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get vehicle by ID")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {
        VehicleDto vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }
    
    @GetMapping
    @Operation(summary = "Get all vehicles with pagination")
    public ResponseEntity<PageResponse<VehicleDto>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        PageResponse<VehicleDto> vehicles = vehicleService.getAllVehicles(page, size, sortBy, direction);
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/available")
    @Operation(summary = "Get available vehicles")
    public ResponseEntity<PageResponse<VehicleDto>> getAvailableVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Vehicle.VehicleType vehicleType) {
        PageResponse<VehicleDto> vehicles = vehicleService.getAvailableVehicles(page, size, department, vehicleType);
        return ResponseEntity.ok(vehicles);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update vehicle")
    public ResponseEntity<VehicleDto> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleCreateRequest request) {
        VehicleDto vehicle = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(vehicle);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete vehicle")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update vehicle status")
    public ResponseEntity<VehicleDto> updateVehicleStatus(
            @PathVariable Long id,
            @RequestParam Vehicle.VehicleStatus status) {
        VehicleDto vehicle = vehicleService.updateVehicleStatus(id, status);
        return ResponseEntity.ok(vehicle);
    }
}


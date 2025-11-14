package com.enterprise.carshare.controller;

import com.enterprise.carshare.domain.MaintenanceTask;
import com.enterprise.carshare.dto.MaintenanceTaskCreateRequest;
import com.enterprise.carshare.dto.MaintenanceTaskDto;
import com.enterprise.carshare.dto.PageResponse;
import com.enterprise.carshare.service.MaintenanceService;
import com.enterprise.carshare.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/maintenance")
@RequiredArgsConstructor
@Tag(name = "Maintenance", description = "Maintenance task management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class MaintenanceController {
    
    private final MaintenanceService maintenanceService;
    private final JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("JWT token not found");
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MAINTENANCE')")
    @Operation(summary = "Create a maintenance task")
    public ResponseEntity<MaintenanceTaskDto> createMaintenanceTask(
            @Valid @RequestBody MaintenanceTaskCreateRequest request,
            HttpServletRequest httpRequest) {
        Long createdById = getUserIdFromRequest(httpRequest);
        MaintenanceTaskDto task = maintenanceService.createMaintenanceTask(createdById, request);
        return ResponseEntity.ok(task);
    }
    
    @GetMapping
    @Operation(summary = "Get all maintenance tasks")
    public ResponseEntity<PageResponse<MaintenanceTaskDto>> getAllMaintenanceTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<MaintenanceTaskDto> tasks = maintenanceService.getAllMaintenanceTasks(page, size);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get maintenance tasks for a vehicle")
    public ResponseEntity<PageResponse<MaintenanceTaskDto>> getMaintenanceTasksByVehicle(
            @PathVariable Long vehicleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<MaintenanceTaskDto> tasks = maintenanceService.getMaintenanceTasksByVehicle(vehicleId, page, size);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance task by ID")
    public ResponseEntity<MaintenanceTaskDto> getMaintenanceTaskById(@PathVariable Long id) {
        MaintenanceTaskDto task = maintenanceService.getMaintenanceTaskById(id);
        return ResponseEntity.ok(task);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MAINTENANCE')")
    @Operation(summary = "Update maintenance task status")
    public ResponseEntity<MaintenanceTaskDto> updateMaintenanceTaskStatus(
            @PathVariable Long id,
            @RequestParam MaintenanceTask.MaintenanceStatus status) {
        MaintenanceTaskDto task = maintenanceService.updateMaintenanceTaskStatus(id, status);
        return ResponseEntity.ok(task);
    }
}


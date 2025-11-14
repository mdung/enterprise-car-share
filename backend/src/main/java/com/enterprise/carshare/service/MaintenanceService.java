package com.enterprise.carshare.service;

import com.enterprise.carshare.domain.MaintenanceTask;
import com.enterprise.carshare.domain.User;
import com.enterprise.carshare.domain.Vehicle;
import com.enterprise.carshare.dto.MaintenanceTaskCreateRequest;
import com.enterprise.carshare.dto.MaintenanceTaskDto;
import com.enterprise.carshare.dto.PageResponse;
import com.enterprise.carshare.mapper.MaintenanceTaskMapper;
import com.enterprise.carshare.repository.MaintenanceTaskRepository;
import com.enterprise.carshare.repository.UserRepository;
import com.enterprise.carshare.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {
    
    private final MaintenanceTaskRepository maintenanceTaskRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final MaintenanceTaskMapper maintenanceTaskMapper;
    
    @Transactional
    public MaintenanceTaskDto createMaintenanceTask(Long createdById, MaintenanceTaskCreateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        MaintenanceTask task = MaintenanceTask.builder()
                .vehicle(vehicle)
                .createdBy(createdBy)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : MaintenanceTask.MaintenanceStatus.OPEN)
                .plannedDate(request.getPlannedDate())
                .cost(request.getCost())
                .workshopName(request.getWorkshopName())
                .build();
        
        // If task is in progress, mark vehicle as under maintenance
        if (task.getStatus() == MaintenanceTask.MaintenanceStatus.IN_PROGRESS) {
            vehicle.setStatus(Vehicle.VehicleStatus.MAINTENANCE);
            vehicleRepository.save(vehicle);
        }
        
        task = maintenanceTaskRepository.save(task);
        return maintenanceTaskMapper.toDto(task);
    }
    
    public MaintenanceTaskDto getMaintenanceTaskById(Long id) {
        MaintenanceTask task = maintenanceTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance task not found"));
        return maintenanceTaskMapper.toDto(task);
    }
    
    public PageResponse<MaintenanceTaskDto> getAllMaintenanceTasks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("plannedDate").descending());
        Page<MaintenanceTask> taskPage = maintenanceTaskRepository.findAll(pageable);
        
        List<MaintenanceTaskDto> content = taskPage.getContent().stream()
                .map(maintenanceTaskMapper::toDto)
                .toList();
        
        return PageResponse.<MaintenanceTaskDto>builder()
                .content(content)
                .page(taskPage.getNumber())
                .size(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .first(taskPage.isFirst())
                .last(taskPage.isLast())
                .build();
    }
    
    public PageResponse<MaintenanceTaskDto> getMaintenanceTasksByVehicle(Long vehicleId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("plannedDate").descending());
        Page<MaintenanceTask> taskPage = maintenanceTaskRepository.findByVehicleId(vehicleId, pageable);
        
        List<MaintenanceTaskDto> content = taskPage.getContent().stream()
                .map(maintenanceTaskMapper::toDto)
                .toList();
        
        return PageResponse.<MaintenanceTaskDto>builder()
                .content(content)
                .page(taskPage.getNumber())
                .size(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .first(taskPage.isFirst())
                .last(taskPage.isLast())
                .build();
    }
    
    @Transactional
    public MaintenanceTaskDto updateMaintenanceTaskStatus(Long id, MaintenanceTask.MaintenanceStatus status) {
        MaintenanceTask task = maintenanceTaskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance task not found"));
        
        task.setStatus(status);
        
        if (status == MaintenanceTask.MaintenanceStatus.DONE) {
            task.setCompletedDate(LocalDate.now());
            // Mark vehicle as available if maintenance is done
            task.getVehicle().setStatus(Vehicle.VehicleStatus.AVAILABLE);
            vehicleRepository.save(task.getVehicle());
        } else if (status == MaintenanceTask.MaintenanceStatus.IN_PROGRESS) {
            // Mark vehicle as under maintenance
            task.getVehicle().setStatus(Vehicle.VehicleStatus.MAINTENANCE);
            vehicleRepository.save(task.getVehicle());
        }
        
        task = maintenanceTaskRepository.save(task);
        return maintenanceTaskMapper.toDto(task);
    }
}


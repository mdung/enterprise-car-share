package com.enterprise.carshare.service;

import com.enterprise.carshare.domain.Vehicle;
import com.enterprise.carshare.dto.PageResponse;
import com.enterprise.carshare.dto.VehicleCreateRequest;
import com.enterprise.carshare.dto.VehicleDto;
import com.enterprise.carshare.mapper.VehicleMapper;
import com.enterprise.carshare.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {
    
    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;
    
    @Transactional
    public VehicleDto createVehicle(VehicleCreateRequest request) {
        if (vehicleRepository.existsByPlateNumber(request.getPlateNumber())) {
            throw new RuntimeException("Vehicle with plate number already exists");
        }
        
        Vehicle vehicle = Vehicle.builder()
                .plateNumber(request.getPlateNumber())
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .color(request.getColor())
                .vehicleType(request.getVehicleType())
                .fuelType(request.getFuelType())
                .capacity(request.getCapacity())
                .vin(request.getVin())
                .departmentOwner(request.getDepartmentOwner())
                .costCenter(request.getCostCenter())
                .lastServiceDate(request.getLastServiceDate())
                .nextServiceDue(request.getNextServiceDue())
                .insuranceExpiryDate(request.getInsuranceExpiryDate())
                .registrationExpiryDate(request.getRegistrationExpiryDate())
                .status(Vehicle.VehicleStatus.AVAILABLE)
                .currentMileage(0L)
                .build();
        
        vehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(vehicle);
    }
    
    public VehicleDto getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return vehicleMapper.toDto(vehicle);
    }
    
    public PageResponse<VehicleDto> getAllVehicles(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(pageable);
        List<VehicleDto> content = vehiclePage.getContent().stream()
                .map(vehicleMapper::toDto)
                .toList();
        
        return PageResponse.<VehicleDto>builder()
                .content(content)
                .page(vehiclePage.getNumber())
                .size(vehiclePage.getSize())
                .totalElements(vehiclePage.getTotalElements())
                .totalPages(vehiclePage.getTotalPages())
                .first(vehiclePage.isFirst())
                .last(vehiclePage.isLast())
                .build();
    }
    
    public PageResponse<VehicleDto> getAvailableVehicles(
            int page, int size, String department, Vehicle.VehicleType vehicleType) {
        Pageable pageable = PageRequest.of(page, size);
        
        Page<Vehicle> vehiclePage = vehicleRepository.findAvailableVehicles(
                Vehicle.VehicleStatus.AVAILABLE, department, vehicleType, pageable);
        
        List<VehicleDto> content = vehiclePage.getContent().stream()
                .map(vehicleMapper::toDto)
                .toList();
        
        return PageResponse.<VehicleDto>builder()
                .content(content)
                .page(vehiclePage.getNumber())
                .size(vehiclePage.getSize())
                .totalElements(vehiclePage.getTotalElements())
                .totalPages(vehiclePage.getTotalPages())
                .first(vehiclePage.isFirst())
                .last(vehiclePage.isLast())
                .build();
    }
    
    @Transactional
    public VehicleDto updateVehicle(Long id, VehicleCreateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        if (!vehicle.getPlateNumber().equals(request.getPlateNumber()) &&
            vehicleRepository.existsByPlateNumber(request.getPlateNumber())) {
            throw new RuntimeException("Plate number already exists");
        }
        
        vehicle.setPlateNumber(request.getPlateNumber());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setColor(request.getColor());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setVin(request.getVin());
        vehicle.setDepartmentOwner(request.getDepartmentOwner());
        vehicle.setCostCenter(request.getCostCenter());
        vehicle.setLastServiceDate(request.getLastServiceDate());
        vehicle.setNextServiceDue(request.getNextServiceDue());
        vehicle.setInsuranceExpiryDate(request.getInsuranceExpiryDate());
        vehicle.setRegistrationExpiryDate(request.getRegistrationExpiryDate());
        
        vehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(vehicle);
    }
    
    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found");
        }
        vehicleRepository.deleteById(id);
    }
    
    @Transactional
    public VehicleDto updateVehicleStatus(Long id, Vehicle.VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setStatus(status);
        vehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toDto(vehicle);
    }
}


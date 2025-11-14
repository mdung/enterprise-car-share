package com.enterprise.carshare.repository;

import com.enterprise.carshare.domain.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByPlateNumber(String plateNumber);
    boolean existsByPlateNumber(String plateNumber);
    
    Page<Vehicle> findByStatus(Vehicle.VehicleStatus status, Pageable pageable);
    
    Page<Vehicle> findByDepartmentOwner(String department, Pageable pageable);
    
    @Query("SELECT v FROM Vehicle v WHERE v.status = :status AND " +
           "(:department IS NULL OR v.departmentOwner = :department) AND " +
           "(:vehicleType IS NULL OR v.vehicleType = :vehicleType)")
    Page<Vehicle> findAvailableVehicles(
        @Param("status") Vehicle.VehicleStatus status,
        @Param("department") String department,
        @Param("vehicleType") Vehicle.VehicleType vehicleType,
        Pageable pageable
    );
}


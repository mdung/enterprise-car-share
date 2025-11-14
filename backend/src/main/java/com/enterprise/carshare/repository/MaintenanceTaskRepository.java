package com.enterprise.carshare.repository;

import com.enterprise.carshare.domain.MaintenanceTask;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long> {
    Page<MaintenanceTask> findByVehicleId(Long vehicleId, Pageable pageable);
    Page<MaintenanceTask> findByStatus(MaintenanceTask.MaintenanceStatus status, Pageable pageable);
}


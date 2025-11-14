package com.enterprise.carshare.mapper;

import com.enterprise.carshare.domain.MaintenanceTask;
import com.enterprise.carshare.dto.MaintenanceTaskDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {VehicleMapper.class})
public interface MaintenanceTaskMapper {
    
    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "createdByEmail", source = "createdBy.email")
    @Mapping(target = "createdAt", source = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", source = "updatedAt", ignore = true)
    MaintenanceTaskDto toDto(MaintenanceTask task);
}


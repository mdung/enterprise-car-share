package com.enterprise.carshare.mapper;

import com.enterprise.carshare.domain.Vehicle;
import com.enterprise.carshare.dto.VehicleDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VehicleMapper {
    
    @Mapping(target = "id", source = "id")
    VehicleDto toDto(Vehicle vehicle);
}


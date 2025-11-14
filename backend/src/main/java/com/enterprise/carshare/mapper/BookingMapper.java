package com.enterprise.carshare.mapper;

import com.enterprise.carshare.domain.Booking;
import com.enterprise.carshare.dto.BookingDto;
import com.enterprise.carshare.dto.BookingUsageDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {VehicleMapper.class})
public interface BookingMapper {
    
    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "userName", expression = "java(booking.getUser().getFirstName() + \" \" + booking.getUser().getLastName())")
    @Mapping(target = "approverId", source = "approver.id")
    @Mapping(target = "approverEmail", source = "approver.email", ignore = true)
    @Mapping(target = "usage", source = "usage", ignore = true)
    @Mapping(target = "vehicle", source = "vehicle", ignore = true)
    BookingDto toDto(Booking booking);
}


package com.enterprise.carshare.service;

import com.enterprise.carshare.domain.Booking;
import com.enterprise.carshare.domain.Vehicle;
import com.enterprise.carshare.dto.ReportDto;
import com.enterprise.carshare.repository.BookingRepository;
import com.enterprise.carshare.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {
    
    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    
    public ReportDto getUsageReport(LocalDate startDate, LocalDate endDate) {
        // Get all completed bookings in the period
        List<Booking> completedBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
                .filter(b -> {
                    LocalDate bookingDate = b.getStartDateTime().toLocalDate();
                    return !bookingDate.isBefore(startDate) && !bookingDate.isAfter(endDate);
                })
                .toList();
        
        long totalBookings = completedBookings.size();
        long totalDistance = completedBookings.stream()
                .filter(b -> b.getUsage() != null && b.getUsage().getDistanceTravelled() != null)
                .mapToLong(b -> b.getUsage().getDistanceTravelled())
                .sum();
        
        // Simple fuel estimation: assume average 10L/100km
        BigDecimal estimatedFuelUsage = BigDecimal.valueOf(totalDistance)
                .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(10));
        
        long totalVehicles = vehicleRepository.count();
        long activeVehicles = vehicleRepository.findByStatus(Vehicle.VehicleStatus.AVAILABLE, null).getTotalElements();
        long vehiclesInMaintenance = vehicleRepository.findByStatus(Vehicle.VehicleStatus.MAINTENANCE, null).getTotalElements();
        
        return ReportDto.builder()
                .periodStart(startDate)
                .periodEnd(endDate)
                .totalBookings(totalBookings)
                .totalDistance(totalDistance)
                .estimatedFuelUsage(estimatedFuelUsage)
                .totalVehicles(totalVehicles)
                .activeVehicles(activeVehicles)
                .vehiclesInMaintenance(vehiclesInMaintenance)
                .build();
    }
}


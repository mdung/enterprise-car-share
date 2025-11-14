package com.enterprise.carshare.repository;

import com.enterprise.carshare.domain.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Page<Booking> findByUserId(Long userId, Pageable pageable);
    
    Page<Booking> findByApproverId(Long approverId, Pageable pageable);
    
    Page<Booking> findByVehicleId(Long vehicleId, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId AND " +
           "b.status IN ('PENDING', 'APPROVED') AND " +
           "((b.startDateTime <= :startDateTime AND b.endDateTime > :startDateTime) OR " +
           "(b.startDateTime < :endDateTime AND b.endDateTime >= :endDateTime) OR " +
           "(b.startDateTime >= :startDateTime AND b.endDateTime <= :endDateTime))")
    List<Booking> findOverlappingBookings(
        @Param("vehicleId") Long vehicleId,
        @Param("startDateTime") LocalDateTime startDateTime,
        @Param("endDateTime") LocalDateTime endDateTime
    );
    
    @Query("SELECT b FROM Booking b WHERE b.status = :status")
    Page<Booking> findByStatus(@Param("status") Booking.BookingStatus status, Pageable pageable);
}


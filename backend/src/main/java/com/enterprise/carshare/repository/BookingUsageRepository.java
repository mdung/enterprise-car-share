package com.enterprise.carshare.repository;

import com.enterprise.carshare.domain.BookingUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingUsageRepository extends JpaRepository<BookingUsage, Long> {
    Optional<BookingUsage> findByBookingId(Long bookingId);
}


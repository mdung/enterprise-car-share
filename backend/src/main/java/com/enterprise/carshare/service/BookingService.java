package com.enterprise.carshare.service;

import com.enterprise.carshare.domain.Booking;
import com.enterprise.carshare.domain.BookingUsage;
import com.enterprise.carshare.domain.User;
import com.enterprise.carshare.domain.Vehicle;
import com.enterprise.carshare.dto.*;
import com.enterprise.carshare.mapper.BookingMapper;
import com.enterprise.carshare.mapper.VehicleMapper;
import com.enterprise.carshare.repository.BookingRepository;
import com.enterprise.carshare.repository.BookingUsageRepository;
import com.enterprise.carshare.repository.UserRepository;
import com.enterprise.carshare.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final BookingUsageRepository bookingUsageRepository;
    private final BookingMapper bookingMapper;
    private final VehicleMapper vehicleMapper;
    
    @Transactional
    public BookingDto createBooking(Long userId, BookingCreateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        
        if (vehicle.getStatus() != Vehicle.VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Vehicle is not available for booking");
        }
        
        // Check for overlapping bookings
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.getVehicleId(), request.getStartDateTime(), request.getEndDateTime());
        
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Vehicle is already booked for the selected time period");
        }
        
        // Validate booking dates
        if (request.getEndDateTime().isBefore(request.getStartDateTime())) {
            throw new RuntimeException("End date must be after start date");
        }
        
        if (request.getStartDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Start date must be in the future");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Booking booking = Booking.builder()
                .vehicle(vehicle)
                .user(user)
                .startDateTime(request.getStartDateTime())
                .endDateTime(request.getEndDateTime())
                .pickupLocation(request.getPickupLocation())
                .returnLocation(request.getReturnLocation())
                .purpose(request.getPurpose())
                .status(Booking.BookingStatus.PENDING)
                .approvalRequired(determineApprovalRequired(user))
                .build();
        
        booking = bookingRepository.save(booking);
        return mapToDtoWithDetails(booking);
    }
    
    private boolean determineApprovalRequired(User user) {
        // Business logic: require approval for certain roles or departments
        // For now, employees always require approval
        return user.getRole() == User.Role.ROLE_EMPLOYEE;
    }
    
    public PageResponse<BookingDto> getUserBookings(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startDateTime").descending());
        Page<Booking> bookingPage = bookingRepository.findByUserId(userId, pageable);
        
        List<BookingDto> content = bookingPage.getContent().stream()
                .map(this::mapToDtoWithDetails)
                .toList();
        
        return PageResponse.<BookingDto>builder()
                .content(content)
                .page(bookingPage.getNumber())
                .size(bookingPage.getSize())
                .totalElements(bookingPage.getTotalElements())
                .totalPages(bookingPage.getTotalPages())
                .first(bookingPage.isFirst())
                .last(bookingPage.isLast())
                .build();
    }
    
    public PageResponse<BookingDto> getAllBookings(int page, int size, Booking.BookingStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("startDateTime").descending());
        Page<Booking> bookingPage = status != null
                ? bookingRepository.findByStatus(status, pageable)
                : bookingRepository.findAll(pageable);
        
        List<BookingDto> content = bookingPage.getContent().stream()
                .map(this::mapToDtoWithDetails)
                .toList();
        
        return PageResponse.<BookingDto>builder()
                .content(content)
                .page(bookingPage.getNumber())
                .size(bookingPage.getSize())
                .totalElements(bookingPage.getTotalElements())
                .totalPages(bookingPage.getTotalPages())
                .first(bookingPage.isFirst())
                .last(bookingPage.isLast())
                .build();
    }
    
    public BookingDto getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToDtoWithDetails(booking);
    }
    
    private BookingDto mapToDtoWithDetails(Booking booking) {
        BookingDto dto = bookingMapper.toDto(booking);
        
        // Map vehicle
        if (booking.getVehicle() != null) {
            dto.setVehicle(vehicleMapper.toDto(booking.getVehicle()));
        }
        
        // Map approver email
        if (booking.getApprover() != null) {
            dto.setApproverEmail(booking.getApprover().getEmail());
        }
        
        // Map usage
        if (booking.getUsage() != null) {
            BookingUsage usage = booking.getUsage();
            BookingUsageDto usageDto = BookingUsageDto.builder()
                    .id(usage.getId())
                    .bookingId(booking.getId())
                    .startMileage(usage.getStartMileage())
                    .endMileage(usage.getEndMileage())
                    .startFuelLevel(usage.getStartFuelLevel())
                    .endFuelLevel(usage.getEndFuelLevel())
                    .distanceTravelled(usage.getDistanceTravelled())
                    .damageReported(usage.getDamageReported())
                    .damageDescription(usage.getDamageDescription())
                    .preTripPhotos(usage.getPreTripPhotos())
                    .postTripPhotos(usage.getPostTripPhotos())
                    .checkoutComments(usage.getCheckoutComments())
                    .checkinComments(usage.getCheckinComments())
                    .checkedOutAt(usage.getCheckedOutAt())
                    .checkedInAt(usage.getCheckedInAt())
                    .build();
            dto.setUsage(usageDto);
        }
        
        return dto;
    }
    
    @Transactional
    public BookingDto approveBooking(Long bookingId, Long approverId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));
        
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }
        
        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking.setApprover(approver);
        booking = bookingRepository.save(booking);
        
        // Update vehicle status
        booking.getVehicle().setStatus(Vehicle.VehicleStatus.IN_USE);
        vehicleRepository.save(booking.getVehicle());
        
        return mapToDtoWithDetails(booking);
    }
    
    @Transactional
    public BookingDto rejectBooking(Long bookingId, Long approverId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));
        
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }
        
        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setApprover(approver);
        booking = bookingRepository.save(booking);
        
        return mapToDtoWithDetails(booking);
    }
    
    @Transactional
    public BookingDto cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }
        
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed booking");
        }
        
        // Store original status before updating
        Booking.BookingStatus originalStatus = booking.getStatus();
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        
        // Update vehicle status if it was approved
        if (originalStatus == Booking.BookingStatus.APPROVED) {
            booking.getVehicle().setStatus(Vehicle.VehicleStatus.AVAILABLE);
            vehicleRepository.save(booking.getVehicle());
        }
        
        return mapToDtoWithDetails(booking);
    }
    
    @Transactional
    public BookingUsageDto checkout(Long bookingId, CheckoutRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != Booking.BookingStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be checked out");
        }
        
        BookingUsage usage = BookingUsage.builder()
                .booking(booking)
                .startMileage(request.getStartMileage())
                .startFuelLevel(request.getStartFuelLevel())
                .preTripPhotos(request.getPreTripPhotos())
                .checkoutComments(request.getCheckoutComments())
                .checkedOutAt(LocalDateTime.now())
                .build();
        
        usage = bookingUsageRepository.save(usage);
        
        // Update vehicle mileage
        booking.getVehicle().setCurrentMileage(request.getStartMileage());
        vehicleRepository.save(booking.getVehicle());
        
        return mapToUsageDto(usage);
    }
    
    @Transactional
    public BookingUsageDto checkin(Long bookingId, CheckinRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        BookingUsage usage = bookingUsageRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking usage not found. Please checkout first."));
        
        if (usage.getCheckedInAt() != null) {
            throw new RuntimeException("Booking already checked in");
        }
        
        usage.setEndMileage(request.getEndMileage());
        usage.setEndFuelLevel(request.getEndFuelLevel());
        usage.setDamageReported(request.getDamageReported() != null && request.getDamageReported());
        usage.setDamageDescription(request.getDamageDescription());
        usage.setPostTripPhotos(request.getPostTripPhotos());
        usage.setCheckinComments(request.getCheckinComments());
        usage.setCheckedInAt(LocalDateTime.now());
        
        // Calculate distance travelled
        if (usage.getStartMileage() != null && request.getEndMileage() != null) {
            usage.setDistanceTravelled(request.getEndMileage() - usage.getStartMileage());
        }
        
        usage = bookingUsageRepository.save(usage);
        
        // Update vehicle status and mileage
        Vehicle vehicle = booking.getVehicle();
        vehicle.setCurrentMileage(request.getEndMileage());
        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
        
        // Mark booking as completed
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        
        return mapToUsageDto(usage);
    }
    
    private BookingUsageDto mapToUsageDto(BookingUsage usage) {
        return BookingUsageDto.builder()
                .id(usage.getId())
                .bookingId(usage.getBooking().getId())
                .startMileage(usage.getStartMileage())
                .endMileage(usage.getEndMileage())
                .startFuelLevel(usage.getStartFuelLevel())
                .endFuelLevel(usage.getEndFuelLevel())
                .distanceTravelled(usage.getDistanceTravelled())
                .damageReported(usage.getDamageReported())
                .damageDescription(usage.getDamageDescription())
                .preTripPhotos(usage.getPreTripPhotos())
                .postTripPhotos(usage.getPostTripPhotos())
                .checkoutComments(usage.getCheckoutComments())
                .checkinComments(usage.getCheckinComments())
                .checkedOutAt(usage.getCheckedOutAt())
                .checkedInAt(usage.getCheckedInAt())
                .build();
    }
}


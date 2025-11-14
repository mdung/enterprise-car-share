package com.enterprise.carshare.controller;

import com.enterprise.carshare.domain.Booking;
import com.enterprise.carshare.dto.*;
import com.enterprise.carshare.service.BookingService;
import com.enterprise.carshare.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {
    
    private final BookingService bookingService;
    private final JwtUtil jwtUtil;
    
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("JWT token not found");
    }
    
    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingDto> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        BookingDto booking = bookingService.createBooking(userId, request);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/my-bookings")
    @Operation(summary = "Get current user's bookings")
    public ResponseEntity<PageResponse<BookingDto>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        PageResponse<BookingDto> bookings = bookingService.getUserBookings(userId, page, size);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('APPROVER')")
    @Operation(summary = "Get all bookings (Admin/Approver only)")
    public ResponseEntity<PageResponse<BookingDto>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Booking.BookingStatus status) {
        PageResponse<BookingDto> bookings = bookingService.getAllBookings(page, size, status);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        BookingDto booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }
    
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('APPROVER')")
    @Operation(summary = "Approve a booking")
    public ResponseEntity<BookingDto> approveBooking(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        Long approverId = getUserIdFromRequest(httpRequest);
        BookingDto booking = bookingService.approveBooking(id, approverId);
        return ResponseEntity.ok(booking);
    }
    
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN') or hasRole('APPROVER')")
    @Operation(summary = "Reject a booking")
    public ResponseEntity<BookingDto> rejectBooking(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        Long approverId = getUserIdFromRequest(httpRequest);
        BookingDto booking = bookingService.rejectBooking(id, approverId);
        return ResponseEntity.ok(booking);
    }
    
    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<BookingDto> cancelBooking(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        BookingDto booking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(booking);
    }
    
    @PostMapping("/{id}/checkout")
    @Operation(summary = "Checkout a booking")
    public ResponseEntity<BookingUsageDto> checkout(
            @PathVariable Long id,
            @Valid @RequestBody CheckoutRequest request) {
        BookingUsageDto usage = bookingService.checkout(id, request);
        return ResponseEntity.ok(usage);
    }
    
    @PostMapping("/{id}/checkin")
    @Operation(summary = "Checkin a booking")
    public ResponseEntity<BookingUsageDto> checkin(
            @PathVariable Long id,
            @Valid @RequestBody CheckinRequest request) {
        BookingUsageDto usage = bookingService.checkin(id, request);
        return ResponseEntity.ok(usage);
    }
}


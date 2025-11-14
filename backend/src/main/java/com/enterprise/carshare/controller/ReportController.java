package com.enterprise.carshare.controller;

import com.enterprise.carshare.dto.ReportDto;
import com.enterprise.carshare.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Reporting and analytics endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {
    
    private final ReportService reportService;
    
    @GetMapping("/usage")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get usage report for a period")
    public ResponseEntity<ReportDto> getUsageReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ReportDto report = reportService.getUsageReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }
}


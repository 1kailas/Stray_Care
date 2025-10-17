package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.DogReport;
import com.straydogcare.service.DogReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dog-reports")
@RequiredArgsConstructor
public class DogReportController {
    
    private final DogReportService dogReportService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<DogReport>>> getAllReports(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String location
    ) {
        List<DogReport> reports;
        
        if (status != null) {
            reports = dogReportService.getReportsByStatus(DogReport.Status.valueOf(status.toUpperCase()));
        } else if (condition != null) {
            reports = dogReportService.getReportsByCondition(DogReport.Condition.valueOf(condition.toUpperCase()));
        } else if (location != null) {
            reports = dogReportService.getReportsByLocation(location);
        } else {
            reports = dogReportService.getAllReports();
        }
        
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DogReport>> getReportById(@PathVariable String id) {
        DogReport report = dogReportService.getReportById(id);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<DogReport>> createReport(
            @RequestBody DogReport report,
            Authentication authentication
    ) {
        // Set reporter information from authenticated user
        if (authentication != null) {
            report.setReportedBy(authentication.getName());
        }
        
        DogReport created = dogReportService.createReport(report);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report created successfully", created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DogReport>> updateReport(
            @PathVariable String id,
            @RequestBody DogReport report
    ) {
        DogReport updated = dogReportService.updateReport(id, report);
        return ResponseEntity.ok(ApiResponse.success("Report updated successfully", updated));
    }
    
    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<DogReport>> assignToVolunteer(
            @PathVariable String id,
            @RequestBody Map<String, String> payload
    ) {
        String volunteerId = payload.get("volunteerId");
        DogReport updated = dogReportService.assignToVolunteer(id, volunteerId);
        return ResponseEntity.ok(ApiResponse.success("Report assigned to volunteer", updated));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DogReport>> updateReportStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload
    ) {
        DogReport.Status status = DogReport.Status.valueOf(payload.get("status").toUpperCase());
        DogReport report = dogReportService.getReportById(id);
        report.setStatus(status);
        DogReport updated = dogReportService.updateReport(id, report);
        return ResponseEntity.ok(ApiResponse.success("Report status updated", updated));
    }
    
    @PostMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<DogReport>> addNote(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            Authentication authentication
    ) {
        String note = payload.get("note");
        DogReport updated = dogReportService.addNote(id, note, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Note added successfully", updated));
    }
    
    @GetMapping("/nearby/{lat}/{lng}")
    public ResponseEntity<ApiResponse<List<DogReport>>> getNearbyReports(
            @PathVariable double lat,
            @PathVariable double lng,
            @RequestParam(defaultValue = "10") double radius
    ) {
        List<DogReport> reports = dogReportService.getNearbyReports(lat, lng, radius);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable String id) {
        dogReportService.deleteReport(id);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully", null));
    }
}

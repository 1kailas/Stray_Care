package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.Volunteer;
import com.straydogcare.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
public class VolunteerController {
    
    private final VolunteerService volunteerService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Volunteer>>> getAllVolunteers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String area
    ) {
        List<Volunteer> volunteers;
        
        if (status != null) {
            volunteers = volunteerService.getVolunteersByStatus(Volunteer.Status.valueOf(status.toUpperCase()));
        } else if (area != null) {
            volunteers = volunteerService.getVolunteersByArea(area);
        } else {
            volunteers = volunteerService.getAllVolunteers();
        }
        
        return ResponseEntity.ok(ApiResponse.success(volunteers));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Volunteer>> getVolunteerById(@PathVariable String id) {
        Volunteer volunteer = volunteerService.getVolunteerById(id);
        return ResponseEntity.ok(ApiResponse.success(volunteer));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Volunteer>> registerVolunteer(@RequestBody Volunteer volunteer) {
        Volunteer created = volunteerService.registerVolunteer(volunteer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Volunteer registered successfully", created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Volunteer>> updateVolunteer(
            @PathVariable String id,
            @RequestBody Volunteer volunteer
    ) {
        Volunteer updated = volunteerService.updateVolunteer(id, volunteer);
        return ResponseEntity.ok(ApiResponse.success("Volunteer updated successfully", updated));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Volunteer>> updateVolunteerStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload
    ) {
        Volunteer.Status status = Volunteer.Status.valueOf(payload.get("status").toUpperCase());
        Volunteer updated = volunteerService.updateVolunteerStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Volunteer status updated", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVolunteer(@PathVariable String id) {
        volunteerService.deleteVolunteer(id);
        return ResponseEntity.ok(ApiResponse.success("Volunteer deleted successfully", null));
    }
}

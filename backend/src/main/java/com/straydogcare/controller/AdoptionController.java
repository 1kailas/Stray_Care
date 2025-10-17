package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.Adoption;
import com.straydogcare.service.AdoptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionController {
    
    private final AdoptionService adoptionService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Adoption>>> getAllAdoptions(
            @RequestParam(required = false) String status
    ) {
        List<Adoption> adoptions;
        
        if (status != null) {
            adoptions = adoptionService.getAdoptionsByStatus(Adoption.Status.valueOf(status.toUpperCase()));
        } else {
            adoptions = adoptionService.getAllAdoptions();
        }
        
        return ResponseEntity.ok(ApiResponse.success(adoptions));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Adoption>> getAdoptionById(@PathVariable String id) {
        Adoption adoption = adoptionService.getAdoptionById(id);
        return ResponseEntity.ok(ApiResponse.success(adoption));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Adoption>> createAdoption(
            @RequestBody Adoption adoption,
            Authentication authentication
    ) {
        // Set adopter ID from authenticated user if available
        if (authentication != null && adoption.getAdopterId() == null) {
            adoption.setAdopterId(authentication.getName());
        }
        
        Adoption created = adoptionService.createAdoption(adoption);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Adoption application submitted", created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Adoption>> updateAdoption(
            @PathVariable String id,
            @RequestBody Adoption adoption,
            Authentication authentication
    ) {
        // Set adopter ID from authenticated user if available
        if (authentication != null && adoption.getAdopterId() == null) {
            adoption.setAdopterId(authentication.getName());
        }
        
        Adoption updated = adoptionService.updateAdoption(id, adoption);
        return ResponseEntity.ok(ApiResponse.success("Adoption updated successfully", updated));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Adoption>> updateAdoptionStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload
    ) {
        Adoption.Status status = Adoption.Status.valueOf(payload.get("status").toUpperCase());
        Adoption updated = adoptionService.updateAdoptionStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Adoption status updated", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdoption(@PathVariable String id) {
        adoptionService.deleteAdoption(id);
        return ResponseEntity.ok(ApiResponse.success("Adoption deleted successfully", null));
    }
}

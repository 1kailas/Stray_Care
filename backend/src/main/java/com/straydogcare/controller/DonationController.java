package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.Donation;
import com.straydogcare.service.DonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {
    
    private final DonationService donationService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Donation>>> getAllDonations() {
        List<Donation> donations = donationService.getAllDonations();
        return ResponseEntity.ok(ApiResponse.success(donations));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Donation>> getDonationById(@PathVariable String id) {
        Donation donation = donationService.getDonationById(id);
        return ResponseEntity.ok(ApiResponse.success(donation));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Donation>> createDonation(
            @RequestBody Donation donation,
            Authentication authentication
    ) {
        // Set donor ID from authenticated user if available and not anonymous
        if (authentication != null && !donation.isAnonymous() && donation.getDonorId() == null) {
            donation.setDonorId(authentication.getName());
        }
        
        Donation created = donationService.createDonation(donation);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Donation initiated", created));
    }
    
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Donation>> completeDonation(@PathVariable String id) {
        Donation completed = donationService.completeDonation(id);
        return ResponseEntity.ok(ApiResponse.success("Donation completed successfully", completed));
    }
    
    @GetMapping("/total")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getTotalDonations() {
        Double total = donationService.getTotalDonations();
        return ResponseEntity.ok(ApiResponse.success(Map.of("total", total)));
    }
}

package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.Vaccination;
import com.straydogcare.service.VaccinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
@RequiredArgsConstructor
public class VaccinationController {
    
    private final VaccinationService vaccinationService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Vaccination>>> getAllVaccinations(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String vetId
    ) {
        List<Vaccination> vaccinations;
        
        if (location != null) {
            vaccinations = vaccinationService.getVaccinationsByLocation(location);
        } else if (vetId != null) {
            vaccinations = vaccinationService.getVaccinationsByVet(vetId);
        } else {
            vaccinations = vaccinationService.getAllVaccinations();
        }
        
        return ResponseEntity.ok(ApiResponse.success(vaccinations));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Vaccination>> getVaccinationById(@PathVariable String id) {
        Vaccination vaccination = vaccinationService.getVaccinationById(id);
        return ResponseEntity.ok(ApiResponse.success(vaccination));
    }
    
    @GetMapping("/dog/{dogReportId}")
    public ResponseEntity<ApiResponse<Vaccination>> getVaccinationByDogReportId(@PathVariable String dogReportId) {
        Vaccination vaccination = vaccinationService.getVaccinationByDogReportId(dogReportId);
        return ResponseEntity.ok(ApiResponse.success(vaccination));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Vaccination>> createVaccination(@RequestBody Vaccination vaccination) {
        Vaccination created = vaccinationService.createVaccination(vaccination);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vaccination record created", created));
    }
    
    @PostMapping("/{id}/records")
    public ResponseEntity<ApiResponse<Vaccination>> addVaccinationRecord(
            @PathVariable String id,
            @RequestBody Vaccination.VaccinationRecord record
    ) {
        Vaccination updated = vaccinationService.addVaccinationRecord(id, record);
        return ResponseEntity.ok(ApiResponse.success("Vaccination record added", updated));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Vaccination>> updateVaccination(
            @PathVariable String id,
            @RequestBody Vaccination vaccination
    ) {
        Vaccination updated = vaccinationService.updateVaccination(id, vaccination);
        return ResponseEntity.ok(ApiResponse.success("Vaccination updated", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVaccination(@PathVariable String id) {
        vaccinationService.deleteVaccination(id);
        return ResponseEntity.ok(ApiResponse.success("Vaccination deleted", null));
    }
}

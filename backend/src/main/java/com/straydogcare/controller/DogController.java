package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.AdoptionDog;
import com.straydogcare.service.DogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dogs")
@RequiredArgsConstructor
public class DogController {
    
    private final DogService dogService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdoptionDog>>> getAllDogs(
            @RequestParam(required = false) String status
    ) {
        List<AdoptionDog> dogs;
        
        if (status != null) {
            dogs = dogService.getDogsByStatus(status);
        } else {
            dogs = dogService.getAllDogs();
        }
        
        return ResponseEntity.ok(ApiResponse.success(dogs));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdoptionDog>> getDogById(@PathVariable String id) {
        AdoptionDog dog = dogService.getDogById(id);
        return ResponseEntity.ok(ApiResponse.success(dog));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AdoptionDog>> createDog(
            @RequestBody AdoptionDog dog,
            Authentication authentication
    ) {
        // Set addedBy from authenticated user if available
        if (authentication != null && dog.getAddedBy() == null) {
            dog.setAddedBy(authentication.getName());
        }
        
        AdoptionDog created = dogService.createDog(dog);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dog record created successfully", created));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AdoptionDog>> updateDog(
            @PathVariable String id,
            @RequestBody AdoptionDog dog
    ) {
        AdoptionDog updated = dogService.updateDog(id, dog);
        return ResponseEntity.ok(ApiResponse.success("Dog record updated successfully", updated));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDog(@PathVariable String id) {
        dogService.deleteDog(id);
        return ResponseEntity.ok(ApiResponse.success("Dog record deleted successfully", null));
    }
}

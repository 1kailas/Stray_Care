package com.straydogcare.service;

import com.straydogcare.model.Vaccination;
import com.straydogcare.repository.VaccinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccinationService {
    
    private final VaccinationRepository vaccinationRepository;
    
    public List<Vaccination> getAllVaccinations() {
        return vaccinationRepository.findAll();
    }
    
    public Vaccination getVaccinationById(String id) {
        return vaccinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaccination record not found"));
    }
    
    public Vaccination getVaccinationByDogReportId(String dogReportId) {
        return vaccinationRepository.findByDogReportId(dogReportId)
                .orElseThrow(() -> new RuntimeException("No vaccination record found for this dog"));
    }
    
    public List<Vaccination> getVaccinationsByVet(String vetId) {
        return vaccinationRepository.findByVetId(vetId);
    }
    
    public List<Vaccination> getVaccinationsByLocation(String location) {
        return vaccinationRepository.findByLocation(location);
    }
    
    public Vaccination createVaccination(Vaccination vaccination) {
        vaccination.setCreatedAt(LocalDateTime.now());
        return vaccinationRepository.save(vaccination);
    }
    
    public Vaccination addVaccinationRecord(String vaccinationId, Vaccination.VaccinationRecord record) {
        Vaccination vaccination = getVaccinationById(vaccinationId);
        vaccination.getRecords().add(record);
        vaccination.setUpdatedAt(LocalDateTime.now());
        return vaccinationRepository.save(vaccination);
    }
    
    public Vaccination updateVaccination(String id, Vaccination vaccination) {
        Vaccination existing = getVaccinationById(id);
        
        if (vaccination.getDogName() != null) existing.setDogName(vaccination.getDogName());
        if (vaccination.getDogDescription() != null) existing.setDogDescription(vaccination.getDogDescription());
        if (vaccination.getVetId() != null) existing.setVetId(vaccination.getVetId());
        if (vaccination.getVetName() != null) existing.setVetName(vaccination.getVetName());
        if (vaccination.getLocation() != null) existing.setLocation(vaccination.getLocation());
        if (vaccination.getNotes() != null) existing.setNotes(vaccination.getNotes());
        if (vaccination.getRecords() != null) existing.setRecords(vaccination.getRecords());
        
        existing.setUpdatedAt(LocalDateTime.now());
        
        return vaccinationRepository.save(existing);
    }
    
    public void deleteVaccination(String id) {
        vaccinationRepository.deleteById(id);
    }
}

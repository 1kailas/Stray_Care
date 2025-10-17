package com.straydogcare.service;

import com.straydogcare.model.AdoptionDog;
import com.straydogcare.repository.AdoptionDogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DogService {
    
    private final AdoptionDogRepository adoptionDogRepository;
    
    public List<AdoptionDog> getAllDogs() {
        return adoptionDogRepository.findAll();
    }
    
    public List<AdoptionDog> getDogsByStatus(String status) {
        return adoptionDogRepository.findByStatus(status);
    }
    
    public AdoptionDog getDogById(String id) {
        return adoptionDogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dog not found with id: " + id));
    }
    
    public AdoptionDog createDog(AdoptionDog dog) {
        dog.setAddedDate(LocalDateTime.now());
        dog.setUpdatedDate(LocalDateTime.now());
        if (dog.getStatus() == null || dog.getStatus().isEmpty()) {
            dog.setStatus("AVAILABLE");
        }
        return adoptionDogRepository.save(dog);
    }
    
    public AdoptionDog updateDog(String id, AdoptionDog dogDetails) {
        AdoptionDog dog = getDogById(id);
        
        if (dogDetails.getName() != null) dog.setName(dogDetails.getName());
        if (dogDetails.getBreed() != null) dog.setBreed(dogDetails.getBreed());
        if (dogDetails.getAge() != null) dog.setAge(dogDetails.getAge());
        if (dogDetails.getGender() != null) dog.setGender(dogDetails.getGender());
        if (dogDetails.getSize() != null) dog.setSize(dogDetails.getSize());
        if (dogDetails.getDescription() != null) dog.setDescription(dogDetails.getDescription());
        if (dogDetails.getPhotos() != null) dog.setPhotos(dogDetails.getPhotos());
        if (dogDetails.getHealthStatus() != null) dog.setHealthStatus(dogDetails.getHealthStatus());
        if (dogDetails.getTemperament() != null) dog.setTemperament(dogDetails.getTemperament());
        if (dogDetails.getSpecialNeeds() != null) dog.setSpecialNeeds(dogDetails.getSpecialNeeds());
        if (dogDetails.getStatus() != null) dog.setStatus(dogDetails.getStatus());
        
        dog.setVaccinated(dogDetails.isVaccinated());
        dog.setNeutered(dogDetails.isNeutered());
        dog.setGoodWithKids(dogDetails.isGoodWithKids());
        dog.setGoodWithPets(dogDetails.isGoodWithPets());
        
        dog.setUpdatedDate(LocalDateTime.now());
        
        return adoptionDogRepository.save(dog);
    }
    
    public void deleteDog(String id) {
        AdoptionDog dog = getDogById(id);
        adoptionDogRepository.delete(dog);
    }
}

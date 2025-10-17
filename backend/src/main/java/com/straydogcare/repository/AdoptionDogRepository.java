package com.straydogcare.repository;

import com.straydogcare.model.AdoptionDog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdoptionDogRepository extends MongoRepository<AdoptionDog, String> {
    
    List<AdoptionDog> findByStatus(String status);
    
    List<AdoptionDog> findByAddedBy(String addedBy);
    
    List<AdoptionDog> findByStatusAndVaccinated(String status, boolean vaccinated);
    
    List<AdoptionDog> findByStatusAndSize(String status, String size);
    
    List<AdoptionDog> findByStatusAndGoodWithKids(String status, boolean goodWithKids);
}

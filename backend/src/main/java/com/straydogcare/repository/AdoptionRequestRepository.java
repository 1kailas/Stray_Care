package com.straydogcare.repository;

import com.straydogcare.model.AdoptionRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdoptionRequestRepository extends MongoRepository<AdoptionRequest, String> {
    
    List<AdoptionRequest> findByStatus(String status);
    
    List<AdoptionRequest> findByUserId(String userId);
    
    List<AdoptionRequest> findByDogId(String dogId);
    
    List<AdoptionRequest> findByDogIdAndStatus(String dogId, String status);
    
    List<AdoptionRequest> findByUserIdAndStatus(String userId, String status);
}

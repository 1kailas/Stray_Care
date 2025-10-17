package com.straydogcare.repository;

import com.straydogcare.model.Adoption;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRepository extends MongoRepository<Adoption, String> {
    List<Adoption> findByStatus(Adoption.Status status);
    List<Adoption> findByAdopterId(String adopterId);
    List<Adoption> findByDogReportId(String dogReportId);
}

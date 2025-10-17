package com.straydogcare.repository;

import com.straydogcare.model.Vaccination;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VaccinationRepository extends MongoRepository<Vaccination, String> {
    Optional<Vaccination> findByDogReportId(String dogReportId);
    List<Vaccination> findByVetId(String vetId);
    List<Vaccination> findByLocation(String location);
}

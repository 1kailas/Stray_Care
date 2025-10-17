package com.straydogcare.repository;

import com.straydogcare.model.Volunteer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerRepository extends MongoRepository<Volunteer, String> {
    Optional<Volunteer> findByUserId(String userId);
    Optional<Volunteer> findByEmail(String email);
    List<Volunteer> findByStatus(Volunteer.Status status);
    List<Volunteer> findByArea(String area);
    List<Volunteer> findByRole(Volunteer.Role role);
    boolean existsByEmail(String email);
}

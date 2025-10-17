package com.straydogcare.repository;

import com.straydogcare.model.Donation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends MongoRepository<Donation, String> {
    List<Donation> findByStatus(Donation.Status status);
    List<Donation> findByDonorId(String donorId);
    List<Donation> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}

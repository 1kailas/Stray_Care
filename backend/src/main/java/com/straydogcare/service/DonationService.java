package com.straydogcare.service;

import com.straydogcare.model.Donation;
import com.straydogcare.model.Notification;
import com.straydogcare.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DonationService {
    
    private final DonationRepository donationRepository;
    private final NotificationService notificationService;
    
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
    
    public List<Donation> getDonationsByStatus(Donation.Status status) {
        return donationRepository.findByStatus(status);
    }
    
    public List<Donation> getDonationsByDonor(String donorId) {
        return donationRepository.findByDonorId(donorId);
    }
    
    public Donation getDonationById(String id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
    }
    
    public Donation createDonation(Donation donation) {
        donation.setStatus(Donation.Status.PENDING);
        donation.setCreatedAt(LocalDateTime.now());
        
        // Generate transaction ID
        donation.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        return donationRepository.save(donation);
    }
    
    public Donation completeDonation(String id) {
        Donation donation = getDonationById(id);
        donation.setStatus(Donation.Status.COMPLETED);
        donation.setCompletedAt(LocalDateTime.now());
        
        Donation updated = donationRepository.save(donation);
        
        // Notify donor
        if (donation.getDonorId() != null) {
            notificationService.createNotification(
                    donation.getDonorId(),
                    "Donation Successful",
                    "Thank you for your generous donation of $" + donation.getAmount(),
                    Notification.Type.DONATION_RECEIVED,
                    id,
                    "DONATION"
            );
        }
        
        // Send tax receipt (in production, integrate with email service)
        sendTaxReceipt(donation);
        
        return updated;
    }
    
    private void sendTaxReceipt(Donation donation) {
        // In production, send email with tax receipt
        // For now, just mark as sent
        donation.setTaxReceiptSent(true);
        donationRepository.save(donation);
    }
    
    public Double getTotalDonations() {
        return donationRepository.findByStatus(Donation.Status.COMPLETED)
                .stream()
                .mapToDouble(Donation::getAmount)
                .sum();
    }
    
    public Double getTotalDonationsInPeriod(LocalDateTime start, LocalDateTime end) {
        return donationRepository.findByCreatedAtBetween(start, end)
                .stream()
                .filter(d -> d.getStatus() == Donation.Status.COMPLETED)
                .mapToDouble(Donation::getAmount)
                .sum();
    }
}

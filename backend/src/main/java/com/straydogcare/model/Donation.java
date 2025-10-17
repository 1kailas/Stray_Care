package com.straydogcare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "donations")
public class Donation {
    
    @Id
    private String id;
    
    private String donorId; // User ID (optional, can be anonymous)
    private String donorName;
    private String donorEmail;
    private Double amount;
    
    private PaymentMethod paymentMethod;
    private String transactionId;
    private Status status = Status.PENDING;
    
    private String purpose; // General, Medical, Food, Shelter, etc.
    private String message;
    
    private boolean anonymous = false;
    private boolean taxReceiptSent = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;
    
    public enum PaymentMethod {
        UPI, PAYPAL, CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER
    }
    
    public enum Status {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}

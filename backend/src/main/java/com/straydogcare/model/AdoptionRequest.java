package com.straydogcare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "adoption_requests")
public class AdoptionRequest {
    
    @Id
    private String id;
    private String dogId;
    private String userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String address;
    private String livingSpace; // APARTMENT, HOUSE, FARM
    private boolean hasYard;
    private boolean hasPets;
    private String petDetails;
    private boolean hasChildren;
    private String childrenAges;
    private String experienceWithDogs;
    private String reason;
    private String status; // PENDING, APPROVED, REJECTED
    private String reviewedBy; // admin user ID
    private String rejectionReason;
    private LocalDateTime requestDate;
    private LocalDateTime reviewedDate;

    // Constructors
    public AdoptionRequest() {
        this.requestDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    public AdoptionRequest(String dogId, String userId, String userName, String userEmail,
                          String userPhone, String address, String livingSpace, boolean hasYard,
                          boolean hasPets, String petDetails, boolean hasChildren,
                          String childrenAges, String experienceWithDogs, String reason) {
        this();
        this.dogId = dogId;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.address = address;
        this.livingSpace = livingSpace;
        this.hasYard = hasYard;
        this.hasPets = hasPets;
        this.petDetails = petDetails;
        this.hasChildren = hasChildren;
        this.childrenAges = childrenAges;
        this.experienceWithDogs = experienceWithDogs;
        this.reason = reason;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDogId() {
        return dogId;
    }

    public void setDogId(String dogId) {
        this.dogId = dogId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLivingSpace() {
        return livingSpace;
    }

    public void setLivingSpace(String livingSpace) {
        this.livingSpace = livingSpace;
    }

    public boolean isHasYard() {
        return hasYard;
    }

    public void setHasYard(boolean hasYard) {
        this.hasYard = hasYard;
    }

    public boolean isHasPets() {
        return hasPets;
    }

    public void setHasPets(boolean hasPets) {
        this.hasPets = hasPets;
    }

    public String getPetDetails() {
        return petDetails;
    }

    public void setPetDetails(String petDetails) {
        this.petDetails = petDetails;
    }

    public boolean isHasChildren() {
        return hasChildren;
    }

    public void setHasChildren(boolean hasChildren) {
        this.hasChildren = hasChildren;
    }

    public String getChildrenAges() {
        return childrenAges;
    }

    public void setChildrenAges(String childrenAges) {
        this.childrenAges = childrenAges;
    }

    public String getExperienceWithDogs() {
        return experienceWithDogs;
    }

    public void setExperienceWithDogs(String experienceWithDogs) {
        this.experienceWithDogs = experienceWithDogs;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getReviewedDate() {
        return reviewedDate;
    }

    public void setReviewedDate(LocalDateTime reviewedDate) {
        this.reviewedDate = reviewedDate;
    }
}

package com.straydogcare.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "adoption_dogs")
public class AdoptionDog {
    
    @Id
    private String id;
    private String name;
    private String breed;
    private Integer age; // in months
    private String gender;
    private String size; // SMALL, MEDIUM, LARGE
    private String description;
    private List<String> photos;
    private String healthStatus;
    private boolean vaccinated;
    private boolean neutered;
    private String temperament;
    private boolean goodWithKids;
    private boolean goodWithPets;
    private String specialNeeds;
    private String status; // AVAILABLE, PENDING, ADOPTED
    private String addedBy; // user ID who added the dog
    private LocalDateTime addedDate;
    private LocalDateTime updatedDate;

    // Constructors
    public AdoptionDog() {
        this.addedDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
        this.status = "AVAILABLE";
    }

    public AdoptionDog(String name, String breed, Integer age, String gender, String size,
                      String description, List<String> photos, String healthStatus,
                      boolean vaccinated, boolean neutered, String temperament,
                      boolean goodWithKids, boolean goodWithPets, String specialNeeds,
                      String addedBy) {
        this();
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.gender = gender;
        this.size = size;
        this.description = description;
        this.photos = photos;
        this.healthStatus = healthStatus;
        this.vaccinated = vaccinated;
        this.neutered = neutered;
        this.temperament = temperament;
        this.goodWithKids = goodWithKids;
        this.goodWithPets = goodWithPets;
        this.specialNeeds = specialNeeds;
        this.addedBy = addedBy;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.updatedDate = LocalDateTime.now();
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
        this.updatedDate = LocalDateTime.now();
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
        this.updatedDate = LocalDateTime.now();
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
        this.updatedDate = LocalDateTime.now();
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
        this.updatedDate = LocalDateTime.now();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        this.updatedDate = LocalDateTime.now();
    }

    public List<String> getPhotos() {
        return photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
        this.updatedDate = LocalDateTime.now();
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
        this.updatedDate = LocalDateTime.now();
    }

    public boolean isVaccinated() {
        return vaccinated;
    }

    public void setVaccinated(boolean vaccinated) {
        this.vaccinated = vaccinated;
        this.updatedDate = LocalDateTime.now();
    }

    public boolean isNeutered() {
        return neutered;
    }

    public void setNeutered(boolean neutered) {
        this.neutered = neutered;
        this.updatedDate = LocalDateTime.now();
    }

    public String getTemperament() {
        return temperament;
    }

    public void setTemperament(String temperament) {
        this.temperament = temperament;
        this.updatedDate = LocalDateTime.now();
    }

    public boolean isGoodWithKids() {
        return goodWithKids;
    }

    public void setGoodWithKids(boolean goodWithKids) {
        this.goodWithKids = goodWithKids;
        this.updatedDate = LocalDateTime.now();
    }

    public boolean isGoodWithPets() {
        return goodWithPets;
    }

    public void setGoodWithPets(boolean goodWithPets) {
        this.goodWithPets = goodWithPets;
        this.updatedDate = LocalDateTime.now();
    }

    public String getSpecialNeeds() {
        return specialNeeds;
    }

    public void setSpecialNeeds(String specialNeeds) {
        this.specialNeeds = specialNeeds;
        this.updatedDate = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedDate = LocalDateTime.now();
    }

    public String getAddedBy() {
        return addedBy;
    }

    public void setAddedBy(String addedBy) {
        this.addedBy = addedBy;
    }

    public LocalDateTime getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(LocalDateTime addedDate) {
        this.addedDate = addedDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }
}

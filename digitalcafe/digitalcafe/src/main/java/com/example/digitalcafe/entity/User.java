package com.example.digitalcafe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;
    @Column(name = "photo")
    private String photo;
    @Column(nullable = false)
    private String role;
    private Integer createdBy;
    @Column(name="cafe_id")
    private Integer cafeId;
    private String email;
    private String phone;
    private String password;

    @Column(columnDefinition = "json")
    private String personalDetails;

    @Column(columnDefinition = "json")
    private String addressDetails;

    @Column(columnDefinition = "json")
    private String educationDetails;

    @Column(columnDefinition = "json")
    private String workDetails;

    @Column(columnDefinition = "json")
    private String documentDetails;
    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }
    @Column(columnDefinition = "json")
    private String cafeDetails;

    @Column(nullable = false)
    private String status = "PENDING";


    public Integer getCreatedBy(){ return createdBy; }
    public void setCreatedBy(Integer createdBy){ this.createdBy=createdBy; }

    public int getUserId() { return userId; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPassword() { return password; }

    public String getPersonalDetails() { return personalDetails; }
    public String getAddressDetails() { return addressDetails; }
    public String getEducationDetails() { return educationDetails; }
    public String getWorkDetails() { return workDetails; }
    public String getDocumentDetails() { return documentDetails; }
    public String getCafeDetails() { return cafeDetails; }

    public String getStatus() { return status; }


    public void setRole(String role) { this.role = role; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPassword(String password) { this.password = password; }

    public void setPersonalDetails(String personalDetails){ this.personalDetails = personalDetails; }
    public void setAddressDetails(String addressDetails){ this.addressDetails = addressDetails; }
    public void setEducationDetails(String educationDetails){ this.educationDetails = educationDetails; }
    public void setWorkDetails(String workDetails){ this.workDetails = workDetails; }
    public void setDocumentDetails(String documentDetails){ this.documentDetails = documentDetails; }
    public Integer getCafeId(){ return cafeId; }
    public void setCafeId(Integer cafeId){ this.cafeId=cafeId; }
    public void setCafeDetails(String cafeDetails){ this.cafeDetails = cafeDetails; }

    public void setStatus(String status){ this.status = status; }
}

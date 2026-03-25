package com.example.digitalcafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "queries")
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    @Column(length = 1000)
    private String message;

    @Column(length = 1000)
    private String reply;

    private String status = "PENDING";

    private LocalDateTime createdAt = LocalDateTime.now();

    // ===== CONSTRUCTORS =====
    public Query() {}

    public Query(Long id, String name, String email, String message, String reply) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.reply = reply;
    }

    // ===== GETTERS & SETTERS =====
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }

    public void setMessage(String message) { this.message = message; }

    public String getReply() { return reply; }

    public void setReply(String reply) { this.reply = reply; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
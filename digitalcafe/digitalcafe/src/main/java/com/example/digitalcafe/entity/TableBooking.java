package com.example.digitalcafe.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_booking")
public class TableBooking {

    @Id
    @Column(name = "booking_id")
    private String bookingId;

    @Column(name = "cafe_id")
    private Integer cafeId;

    @Column(name = "table_id")
    private Integer tableId;

    /* ✅ ADD THIS */
    @Column(name = "table_name")
    private String tableName;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    @Column(name="booking_time")
    private String bookingTime;

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /* ===== Getters and Setters ===== */

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public Integer getCafeId() {
        return cafeId;
    }

    public void setCafeId(Integer cafeId) {
        this.cafeId = cafeId;
    }

    public Integer getTableId() {
        return tableId;
    }

    public void setTableId(Integer tableId) {
        this.tableId = tableId;
    }

    /* ✅ NEW GETTER SETTER */

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(String bookingTime) {
        this.bookingTime = bookingTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
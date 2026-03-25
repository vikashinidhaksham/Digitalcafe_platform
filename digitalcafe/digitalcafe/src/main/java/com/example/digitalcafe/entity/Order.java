package com.example.digitalcafe.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column(name = "order_id")
    private String orderId;

    @Column(name = "booking_id")
    private String bookingId;

    @Column(name = "cafe_id")
    private Integer cafeId;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "table_no")
    private Integer tableNo;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "chef_status")
    private String chefStatus = "PENDING";

    @Column(name = "waiter_status")
    private String waiterStatus = "PENDING";

    // ✅ FIX: default to ACTIVE so it's never NULL in DB
    @Column(name = "order_status")
    private String orderStatus = "ACTIVE";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Order() {}

    // ── Getters & Setters ──

    public String getOrderId()                 { return orderId; }
    public void   setOrderId(String orderId)   { this.orderId = orderId; }

    public String getBookingId()               { return bookingId; }
    public void   setBookingId(String b)       { this.bookingId = b; }

    public Integer getCafeId()                 { return cafeId; }
    public void    setCafeId(Integer c)        { this.cafeId = c; }

    public Integer getCustomerId()             { return customerId; }
    public void    setCustomerId(Integer c)    { this.customerId = c; }

    public Integer getTableNo()                { return tableNo; }
    public void    setTableNo(Integer t)       { this.tableNo = t; }

    public Double  getTotalAmount()            { return totalAmount; }
    public void    setTotalAmount(Double t)    { this.totalAmount = t; }

    public String  getStatus()                 { return status; }
    public void    setStatus(String s)         { this.status = s; }

    public String  getChefStatus()             { return chefStatus; }
    public void    setChefStatus(String s)     { this.chefStatus = s; }

    public String  getWaiterStatus()           { return waiterStatus; }
    public void    setWaiterStatus(String s)   { this.waiterStatus = s; }

    public String  getOrderStatus()            { return orderStatus; }
    public void    setOrderStatus(String s)    { this.orderStatus = s; }

    public LocalDateTime getCreatedAt()        { return createdAt; }
    public void          setCreatedAt(LocalDateTime t) { this.createdAt = t; }
}
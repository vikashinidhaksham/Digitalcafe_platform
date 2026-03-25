package com.example.digitalcafe.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class CustomerOrderDTO {

    private String orderId;
    private String cafeName;
    private Integer tableNo;
    private String tableName;
    private String lastName;
    private String bookingId;
    private String paymentId;
    private LocalDate bookingDate;
    private String bookingTime;
    private Double totalAmount;
    private String chefStatus;
    private String waiterStatus;
    private String paymentMethod;  // ← ADD
    private String orderStatus;    // ← ADD
    private Integer cafeId;        // ← ADD
    private List<Map<String,Object>> items;

    public CustomerOrderDTO(
            String orderId,
            String cafeName,
            Integer tableNo,
            String tableName,
            String lastName,
            String bookingId,
            String paymentId,
            LocalDate bookingDate,
            String bookingTime,
            Double totalAmount,
            String chefStatus,
            String waiterStatus,
            String paymentMethod,  // ← ADD
            String orderStatus,    // ← ADD
            Integer cafeId,        // ← ADD
            List<Map<String,Object>> items
    ){
        this.orderId      = orderId;
        this.cafeName     = cafeName;
        this.tableNo      = tableNo;
        this.tableName    = tableName;
        this.lastName     = lastName;
        this.bookingId    = bookingId;
        this.paymentId    = paymentId;
        this.bookingDate  = bookingDate;
        this.bookingTime  = bookingTime;
        this.totalAmount  = totalAmount;
        this.chefStatus   = chefStatus;
        this.waiterStatus = waiterStatus;
        this.paymentMethod = paymentMethod;  // ← ADD
        this.orderStatus   = orderStatus;    // ← ADD
        this.cafeId        = cafeId;         // ← ADD
        this.items        = items;
    }

    // existing getters stay the same, just add these three:
    public String getPaymentMethod() { return paymentMethod; }
    public String getOrderStatus()   { return orderStatus; }
    public Integer getCafeId()       { return cafeId; }

    // ── all existing getters unchanged ──
    public String getOrderId()        { return orderId; }
    public String getCafeName()       { return cafeName; }
    public Integer getTableNo()       { return tableNo; }
    public String getTableName()      { return tableName; }
    public String getLastName()       { return lastName; }
    public String getBookingId()      { return bookingId; }
    public String getPaymentId()      { return paymentId; }
    public LocalDate getBookingDate() { return bookingDate; }
    public String getBookingTime()    { return bookingTime; }
    public Double getTotalAmount()    { return totalAmount; }
    public String getChefStatus()     { return chefStatus; }
    public String getWaiterStatus()   { return waiterStatus; }
    public List<Map<String,Object>> getItems() { return items; }
}
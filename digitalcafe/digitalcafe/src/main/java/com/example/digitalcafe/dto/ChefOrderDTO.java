package com.example.digitalcafe.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class ChefOrderDTO {

    private String orderId;
    private Integer tableNo;
    private String chefStatus;
    private LocalDate bookingDate;
    private String bookingTime;
    private List<Map<String,Object>> items;

    public ChefOrderDTO(){}

    public ChefOrderDTO(
            String orderId,
            Integer tableNo,
            String chefStatus,
            LocalDate bookingDate,
            String bookingTime,
            List<Map<String,Object>> items
    ){
        this.orderId = orderId;
        this.tableNo = tableNo;
        this.chefStatus = chefStatus;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.items = items;
    }

    public String getOrderId(){ return orderId; }

    public Integer getTableNo(){ return tableNo; }

    public String getChefStatus(){ return chefStatus; }

    public LocalDate getBookingDate(){ return bookingDate; }

    public String getBookingTime(){ return bookingTime; }

    public List<Map<String,Object>> getItems(){ return items; }
}
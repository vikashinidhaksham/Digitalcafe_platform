package com.example.digitalcafe.dto;
import com.example.digitalcafe.dto.OrderItemResponse;
import java.util.List;

public class OrderResponse {

    private String orderId;
    private String cafeName;
    private Integer tableNo;
    private String tableName;
    private String customerName;
    private String paymentId;
    private String bookingId;
    private String bookingDate;
    private String bookingTime;
    private Double totalAmount;

    private String chefStatus;
    private String waiterStatus;

    private List<OrderItemResponse> items;

    public OrderResponse(){}

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCafeName() {
        return cafeName;
    }

    public void setCafeName(String cafeName) {
        this.cafeName = cafeName;
    }

    public Integer getTableNo() {
        return tableNo;
    }

    public void setTableNo(Integer tableNo) {
        this.tableNo = tableNo;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(String bookingTime) {
        this.bookingTime = bookingTime;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getChefStatus() {
        return chefStatus;
    }

    public void setChefStatus(String chefStatus) {
        this.chefStatus = chefStatus;
    }

    public String getWaiterStatus() {
        return waiterStatus;
    }

    public void setWaiterStatus(String waiterStatus) {
        this.waiterStatus = waiterStatus;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}
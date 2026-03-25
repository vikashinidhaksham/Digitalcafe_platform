package com.example.digitalcafe.dto;

public class OrderRequest {

    private String bookingId;
    private int cafeId;
    private int customerId;
    private int tableNo;

    // ✅ FIX: frontend sends "totalAmount" not "total"
    // Make sure this field name matches what Angular sends:
    // this.http.post('http://localhost:8080/api/orders', {
    //   bookingId, cafeId, customerId, totalAmount   <-- this key
    // })
    private double totalAmount;

    public OrderRequest() {}

    public String getBookingId()             { return bookingId; }
    public void   setBookingId(String b)     { this.bookingId = b; }

    public int    getCafeId()                { return cafeId; }
    public void   setCafeId(int c)           { this.cafeId = c; }

    public int    getCustomerId()            { return customerId; }
    public void   setCustomerId(int c)       { this.customerId = c; }

    public int    getTableNo()               { return tableNo; }
    public void   setTableNo(int t)          { this.tableNo = t; }

    public double getTotalAmount()           { return totalAmount; }
    public void   setTotalAmount(double t)   { this.totalAmount = t; }

    // ── Keep backward compat if some code still calls getTotal() ──
    public double getTotal()                 { return totalAmount; }
    public void   setTotal(double t)         { this.totalAmount = t; }
}
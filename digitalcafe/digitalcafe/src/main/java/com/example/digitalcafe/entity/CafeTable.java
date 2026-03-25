package com.example.digitalcafe.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "cafe_tables")
public class CafeTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="cafe_id")
    private int cafeId;

    @Column(name="table_name")
    private String tableName;

    private int seats;

    private String status;

    public int getId() { return id; }

    public int getCafeId() { return cafeId; }

    public void setCafeId(int cafeId) { this.cafeId = cafeId; }

    public String getTableName() { return tableName; }

    public void setTableName(String tableName) { this.tableName = tableName; }

    public int getSeats() { return seats; }

    public void setSeats(int seats) { this.seats = seats; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }
}
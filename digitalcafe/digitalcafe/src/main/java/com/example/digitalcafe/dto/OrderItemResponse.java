package com.example.digitalcafe.dto;

public class OrderItemResponse {

    private String menuName;
    private Integer qty;
    private Double price;

    public OrderItemResponse(){}

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

}
package com.yujie.backend.dto;

public class OrderItemResponse {

    private Long id;
    private Long mealId;
    private String mealName;
    private Integer quantity;
    private Double itemPrice;
    private Double subtotal;

    public OrderItemResponse() {
    }

    public OrderItemResponse(Long id, Long mealId, String mealName,
                             Integer quantity, Double itemPrice, Double subtotal) {
        this.id = id;
        this.mealId = mealId;
        this.mealName = mealName;
        this.quantity = quantity;
        this.itemPrice = itemPrice;
        this.subtotal = subtotal;
    }

    public Long getId() {
        return id;
    }

    public Long getMealId() {
        return mealId;
    }

    public String getMealName() {
        return mealName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Double getItemPrice() {
        return itemPrice;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMealId(Long mealId) {
        this.mealId = mealId;
    }

    public void setMealName(String mealName) {
        this.mealName = mealName;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setItemPrice(Double itemPrice) {
        this.itemPrice = itemPrice;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}
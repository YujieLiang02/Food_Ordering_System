package com.yujie.backend.dto;

public class OrderItemRequest {

    private Long mealId;
    private int quantity;

    public OrderItemRequest() {
    }

    public OrderItemRequest(Long mealId, int quantity) {
        this.mealId = mealId;
        this.quantity = quantity;
    }

    public Long getMealId() {
        return mealId;
    }

    public void setMealId(Long mealId) {
        this.mealId = mealId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
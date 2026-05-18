package com.yujie.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateOrderItemRequest {

    @NotNull(message = "Meal id cannot be null")
    private Long mealId;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public CreateOrderItemRequest() {
    }

    public CreateOrderItemRequest(Long mealId, Integer quantity) {
        this.mealId = mealId;
        this.quantity = quantity;
    }

    public Long getMealId() {
        return mealId;
    }

    public void setMealId(Long mealId) {
        this.mealId = mealId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
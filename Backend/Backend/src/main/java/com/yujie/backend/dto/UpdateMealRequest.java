package com.yujie.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class UpdateMealRequest {

    @NotBlank(message = "Meal name cannot be blank")
    @Size(max = 100, message = "Meal name cannot be longer than 100 characters")
    private String name;

    @Size(max = 255, message = "Description cannot be longer than 255 characters")
    private String description;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Meal type id cannot be null")
    private Long mealTypeId;

    public UpdateMealRequest() {
    }

    public UpdateMealRequest(String name, String description, Double price, Long mealTypeId) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.mealTypeId = mealTypeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getMealTypeId() {
        return mealTypeId;
    }

    public void setMealTypeId(Long mealTypeId) {
        this.mealTypeId = mealTypeId;
    }
}
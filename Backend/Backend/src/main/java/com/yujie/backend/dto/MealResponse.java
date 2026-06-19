package com.yujie.backend.dto;

public class MealResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Long mealTypeId;
    private String mealTypeName;
    private String imageUrl;

    public MealResponse() {
    }

    public MealResponse(
            Long id,
            String name,
            String description,
            Double price,
            Long mealTypeId,
            String mealTypeName,
            String imageUrl
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.mealTypeId = mealTypeId;
        this.mealTypeName = mealTypeName;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public Long getMealTypeId() {
        return mealTypeId;
    }

    public String getMealTypeName() {
        return mealTypeName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setMealTypeId(Long mealTypeId) {
        this.mealTypeId = mealTypeId;
    }

    public void setMealTypeName(String mealTypeName) {
        this.mealTypeName = mealTypeName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
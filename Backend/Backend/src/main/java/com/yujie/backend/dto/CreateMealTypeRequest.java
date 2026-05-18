package com.yujie.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateMealTypeRequest {

    @NotBlank(message = "Meal type name cannot be blank")
    @Size(max = 100, message = "Meal type name cannot be longer than 100 characters")
    private String name;

    @Size(max = 255, message = "Description cannot be longer than 255 characters")
    private String description;

    public CreateMealTypeRequest() {
    }

    public CreateMealTypeRequest(String name, String description) {
        this.name = name;
        this.description = description;
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
}
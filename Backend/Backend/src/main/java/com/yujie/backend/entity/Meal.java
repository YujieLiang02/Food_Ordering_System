package com.yujie.backend.entity;
import jakarta.persistence.*;

@Entity
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private boolean available = true;

    @ManyToOne
    @JoinColumn(name = "meal_type_id")
    private MealType mealType;

    public Meal() {
    }

    public Meal(String name, String description, double price, boolean available, MealType mealType) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.available = available;
        this.mealType = mealType;
    }

    public Long getId() {
        return id;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public MealType getMealType() {
        return mealType;
    }

    public void setMealType(MealType mealType) {
        this.mealType = mealType;
    }
}
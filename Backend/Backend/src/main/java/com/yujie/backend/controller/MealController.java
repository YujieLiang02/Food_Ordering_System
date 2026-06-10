package com.yujie.backend.controller;

import com.yujie.backend.dto.MealResponse;
import com.yujie.backend.service.MealService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public ResponseEntity<List<MealResponse>> getAllMeals() {
        return ResponseEntity.ok(mealService.getAllMeals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealResponse> getMealById(@PathVariable Long id) {
        return ResponseEntity.ok(mealService.getMealById(id));
    }

    @GetMapping("/type/{mealTypeId}")
    public ResponseEntity<List<MealResponse>> getMealsByTypeId(@PathVariable Long mealTypeId) {
        return ResponseEntity.ok(mealService.getMealsByTypeId(mealTypeId));
    }
}
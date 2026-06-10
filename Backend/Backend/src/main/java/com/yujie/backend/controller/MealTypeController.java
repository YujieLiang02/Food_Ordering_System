package com.yujie.backend.controller;

import com.yujie.backend.dto.MealTypeResponse;
import com.yujie.backend.service.MealTypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meal-types")
public class MealTypeController {

    private final MealTypeService mealTypeService;

    public MealTypeController(MealTypeService mealTypeService) {
        this.mealTypeService = mealTypeService;
    }

    @GetMapping
    public ResponseEntity<List<MealTypeResponse>> getAllMealTypes() {
        return ResponseEntity.ok(mealTypeService.getAllMealTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealTypeResponse> getMealTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(mealTypeService.getMealTypeById(id));
    }
}
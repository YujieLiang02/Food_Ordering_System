package com.yujie.backend.controller.admin;

import com.yujie.backend.dto.CreateMealRequest;
import com.yujie.backend.dto.MealResponse;
import com.yujie.backend.dto.UpdateMealRequest;
import com.yujie.backend.service.MealService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/meals")
public class AdminMealController {

    private final MealService mealService;

    public AdminMealController(MealService mealService) {
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

    @PostMapping
    public ResponseEntity<MealResponse> createMeal(
            @Valid @RequestBody CreateMealRequest request
    ) {
        return ResponseEntity.ok(mealService.createMeal(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealResponse> updateMeal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMealRequest request
    ) {
        return ResponseEntity.ok(mealService.updateMeal(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        mealService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }
}
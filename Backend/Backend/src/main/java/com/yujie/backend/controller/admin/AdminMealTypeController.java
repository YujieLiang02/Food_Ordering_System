package com.yujie.backend.controller.admin;

import com.yujie.backend.dto.CreateMealTypeRequest;
import com.yujie.backend.dto.MealTypeResponse;
import com.yujie.backend.dto.UpdateMealTypeRequest;
import com.yujie.backend.service.MealTypeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/meal-types")
public class AdminMealTypeController {

    private final MealTypeService mealTypeService;

    public AdminMealTypeController(MealTypeService mealTypeService) {
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

    @PostMapping
    public ResponseEntity<MealTypeResponse> createMealType(
            @Valid @RequestBody CreateMealTypeRequest request
    ) {
        return ResponseEntity.ok(mealTypeService.createMealType(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealTypeResponse> updateMealType(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMealTypeRequest request
    ) {
        return ResponseEntity.ok(mealTypeService.updateMealType(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealType(@PathVariable Long id) {
        mealTypeService.deleteMealType(id);
        return ResponseEntity.noContent().build();
    }
}
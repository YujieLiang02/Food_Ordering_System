package com.yujie.backend.service;

import com.yujie.backend.dto.CreateMealRequest;
import com.yujie.backend.dto.MealResponse;
import com.yujie.backend.dto.UpdateMealRequest;
import com.yujie.backend.entity.Meal;
import com.yujie.backend.entity.MealType;
import com.yujie.backend.exception.ResourceNotFoundException;
import com.yujie.backend.repository.MealRepository;
import com.yujie.backend.repository.MealTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MealService {

    private final MealRepository mealRepository;
    private final MealTypeRepository mealTypeRepository;

    public MealService(MealRepository mealRepository, MealTypeRepository mealTypeRepository) {
        this.mealRepository = mealRepository;
        this.mealTypeRepository = mealTypeRepository;
    }

    public List<MealResponse> getAllMeals() {
        return mealRepository.findAll()
                .stream()
                .map(this::mapToMealResponse)
                .toList();
    }

    public MealResponse getMealById(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));

        return mapToMealResponse(meal);
    }

    public List<MealResponse> getMealsByTypeId(Long mealTypeId) {
        return mealRepository.findByMealTypeId(mealTypeId)
                .stream()
                .map(this::mapToMealResponse)
                .toList();
    }

    public MealResponse createMeal(CreateMealRequest request) {
        MealType mealType = mealTypeRepository.findById(request.getMealTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Meal type not found with id: " + request.getMealTypeId()));

        Meal meal = new Meal();
        meal.setName(request.getName());
        meal.setDescription(request.getDescription());
        meal.setPrice(request.getPrice());
        meal.setMealType(mealType);

        Meal savedMeal = mealRepository.save(meal);

        return mapToMealResponse(savedMeal);
    }

    public MealResponse updateMeal(Long id, UpdateMealRequest request) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));

        MealType mealType = mealTypeRepository.findById(request.getMealTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Meal type not found with id: " + request.getMealTypeId()));

        meal.setName(request.getName());
        meal.setDescription(request.getDescription());
        meal.setPrice(request.getPrice());
        meal.setMealType(mealType);

        Meal updatedMeal = mealRepository.save(meal);

        return mapToMealResponse(updatedMeal);
    }

    public void deleteMeal(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));

        mealRepository.delete(meal);
    }

    private MealResponse mapToMealResponse(Meal meal) {
        Long mealTypeId = null;
        String mealTypeName = null;

        if (meal.getMealType() != null) {
            mealTypeId = meal.getMealType().getId();
            mealTypeName = meal.getMealType().getName();
        }

        return new MealResponse(
                meal.getId(),
                meal.getName(),
                meal.getDescription(),
                meal.getPrice(),
                mealTypeId,
                mealTypeName
        );
    }
}
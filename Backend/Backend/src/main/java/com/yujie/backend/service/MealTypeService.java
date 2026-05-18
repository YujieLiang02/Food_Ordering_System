package com.yujie.backend.service;

import com.yujie.backend.dto.CreateMealTypeRequest;
import com.yujie.backend.dto.MealTypeResponse;
import com.yujie.backend.dto.UpdateMealTypeRequest;
import com.yujie.backend.entity.MealType;
import com.yujie.backend.exception.ResourceNotFoundException;
import com.yujie.backend.repository.MealTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MealTypeService {

    private final MealTypeRepository mealTypeRepository;

    public MealTypeService(MealTypeRepository mealTypeRepository) {
        this.mealTypeRepository = mealTypeRepository;
    }

    public List<MealTypeResponse> getAllMealTypes() {
        return mealTypeRepository.findAll()
                .stream()
                .map(this::mapToMealTypeResponse)
                .toList();
    }

    public MealTypeResponse getMealTypeById(Long id) {
        MealType mealType = mealTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal type not found with id: " + id));

        return mapToMealTypeResponse(mealType);
    }

    public MealTypeResponse createMealType(CreateMealTypeRequest request) {
        MealType mealType = new MealType();
        mealType.setName(request.getName());
        mealType.setDescription(request.getDescription());

        MealType savedMealType = mealTypeRepository.save(mealType);

        return mapToMealTypeResponse(savedMealType);
    }

    public MealTypeResponse updateMealType(Long id, UpdateMealTypeRequest request) {
        MealType mealType = mealTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal type not found with id: " + id));

        mealType.setName(request.getName());
        mealType.setDescription(request.getDescription());

        MealType updatedMealType = mealTypeRepository.save(mealType);

        return mapToMealTypeResponse(updatedMealType);
    }

    public void deleteMealType(Long id) {
        MealType mealType = mealTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal type not found with id: " + id));

        mealTypeRepository.delete(mealType);
    }

    private MealTypeResponse mapToMealTypeResponse(MealType mealType) {
        return new MealTypeResponse(
                mealType.getId(),
                mealType.getName(),
                mealType.getDescription()
        );
    }
}
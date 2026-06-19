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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
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

    @Transactional
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

    @Transactional
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

    @Transactional
    public MealResponse uploadMealImage(Long id, MultipartFile image) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be empty");
        }

        String contentType = image.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        String originalFilename = image.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID() + extension;

        try {
            Path uploadDir = Paths.get("uploads", "meals");
            Files.createDirectories(uploadDir);

            Path targetPath = uploadDir.resolve(filename);
            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new RuntimeException("Failed to upload meal image", exception);
        }

        meal.setImageUrl("/uploads/meals/" + filename);
        Meal updatedMeal = mealRepository.save(meal);

        return mapToMealResponse(updatedMeal);
    }

    @Transactional
    public void deleteMeal(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));

        mealRepository.delete(meal);
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isBlank() || !filename.contains(".")) {
            return "";
        }

        return filename.substring(filename.lastIndexOf("."));
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
                mealTypeName,
                meal.getImageUrl()
        );
    }
}
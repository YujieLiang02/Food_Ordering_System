package com.yujie.backend.repository;

import com.yujie.backend.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {

    List<Meal> findByMealTypeId(Long mealTypeId);
}
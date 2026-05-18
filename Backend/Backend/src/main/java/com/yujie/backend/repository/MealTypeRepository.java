package com.yujie.backend.repository;

import com.yujie.backend.entity.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MealTypeRepository extends JpaRepository<MealType, Long> {
}
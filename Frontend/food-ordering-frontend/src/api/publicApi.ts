import { request } from "./request";
import type { Meal, MealType, Order } from "../types";

export function getMealTypes() {
  return request<MealType[]>("/api/meal-types");
}

export function getMeals() {
  return request<Meal[]>("/api/meals");
}

export function getMealsByType(mealTypeId: number) {
  return request<Meal[]>(`/api/meals/type/${mealTypeId}`);
}

export function createOrder(data: {
  customerName: string;
  items: {
    mealId: number;
    quantity: number;
  }[];
}) {
  return request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getOrderById(id: number) {
  return request<Order>(`/api/orders/${id}`);
}
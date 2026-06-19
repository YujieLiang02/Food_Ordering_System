import { request } from "./request";
import type {
  Meal,
  MealPayload,
  MealType,
  MealTypePayload,
  Order,
  OrderStatus,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function checkAdminEntryCode(entryCode: string) {
  return request<{
    allowed: boolean;
    message: string;
  }>("/api/admin/entry/check", {
    method: "POST",
    body: JSON.stringify({
      entryCode,
    }),
  });
}

export function adminLogin(data: { username: string; password: string }) {
  return request<{ token: string } | string>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAdminOrders(token: string) {
  return request<Order[]>("/api/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAdminOrdersByStatus(status: OrderStatus, token: string) {
  return request<Order[]>(`/api/admin/orders/status/${status}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
  token: string
) {
  return request<Order>(`/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}

export function adminLogout(token: string) {
  return request<{ message: string }>("/api/admin/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* Meal management */

export function getAdminMeals(token: string) {
  return request<Meal[]>("/api/admin/meals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createAdminMeal(data: MealPayload, token: string) {
  return request<Meal>("/api/admin/meals", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function updateAdminMeal(
  mealId: number,
  data: MealPayload,
  token: string
) {
  return request<Meal>(`/api/admin/meals/${mealId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function deleteAdminMeal(mealId: number, token: string) {
  return request<void>(`/api/admin/meals/${mealId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function uploadMealImage(
  mealId: number,
  image: File,
  token: string
) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${API_BASE_URL}/api/admin/meals/${mealId}/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Upload failed with status: ${response.status}`);
  }

  return response.json() as Promise<Meal>;
}

/* Meal type management */

export function getAdminMealTypes(token: string) {
  return request<MealType[]>("/api/admin/meal-types", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createAdminMealType(data: MealTypePayload, token: string) {
  return request<MealType>("/api/admin/meal-types", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function updateAdminMealType(
  mealTypeId: number,
  data: MealTypePayload,
  token: string
) {
  return request<MealType>(`/api/admin/meal-types/${mealTypeId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export function deleteAdminMealType(mealTypeId: number, token: string) {
  return request<void>(`/api/admin/meal-types/${mealTypeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
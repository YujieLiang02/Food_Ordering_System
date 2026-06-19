export type OrderStatus = "PENDING" | "PREPARING" | "COMPLETED" | "CANCELLED";

export interface MealType {
  id: number;
  name: string;
  description?: string;
}

export interface Meal {
  id: number;
  name: string;
  description?: string;
  price: number;
  mealTypeId: number;
  mealTypeName: string;
  imageUrl?: string;
}

export interface MealPayload {
  name: string;
  description: string;
  price: number;
  mealTypeId: number;
}

export interface MealTypePayload {
  name: string;
  description: string;
}

export interface CartItem {
  mealId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderItem {
  id: number;
  mealId: number;
  mealName: string;
  quantity: number;
  itemPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  customerName: string;
  orderTime: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
}
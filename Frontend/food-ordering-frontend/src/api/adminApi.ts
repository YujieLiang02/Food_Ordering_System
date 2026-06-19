import { request } from "./request";
import type { Order, OrderStatus } from "../types";

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
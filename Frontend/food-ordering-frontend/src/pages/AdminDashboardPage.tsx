import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminLogout,
  getAdminOrders,
  getAdminOrdersByStatus,
  updateOrderStatus,
} from "../api/adminApi";
import type { Order, OrderStatus } from "../types";

type StatusFilter = "ALL" | OrderStatus;

const statusFilters: StatusFilter[] = [
  "ALL",
  "PENDING",
  "PREPARING",
  "COMPLETED",
  "CANCELLED",
];

function AdminDashboardPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin");
      return;
    }

    loadOrders(token, selectedStatus);
  }, [selectedStatus, navigate]);

  async function loadOrders(token: string, status: StatusFilter) {
    try {
      setLoading(true);
      setError("");

      const orderData =
        status === "ALL"
          ? await getAdminOrders(token)
          : await getAdminOrdersByStatus(status, token);

      setOrders(orderData);
    } catch {
      setError("Failed to load orders. Please log in again.");
      localStorage.removeItem("adminToken");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  }

  function formatOrderTime(orderTime: string) {
    if (!orderTime) {
      return "N/A";
    }

    return new Date(orderTime).toLocaleString();
  }

  function getNextStatuses(status: OrderStatus): OrderStatus[] {
    if (status === "PENDING") {
      return ["PREPARING", "CANCELLED"];
    }

    if (status === "PREPARING") {
      return ["COMPLETED", "CANCELLED"];
    }

    return [];
  }

  async function handleUpdateStatus(orderId: number, nextStatus: OrderStatus) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin");
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      setError("");

      await updateOrderStatus(orderId, nextStatus, token);
      await loadOrders(token, selectedStatus);
    } catch {
      setError("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleLogout() {
    const token = localStorage.getItem("adminToken");

    try {
      if (token) {
        await adminLogout(token);
      }
    } catch {
      // Even if backend logout fails, the frontend token should still be cleared.
    } finally {
      localStorage.removeItem("adminToken");
      navigate("/admin");
    }
  }

  return (
    <div className="page">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage customer orders and update order status.</p>
        </div>

        <div className="admin-header-actions">
          <button
            className="manage-menu-btn"
            onClick={() => navigate("/admin/menu")}
          >
            Manage Menu
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-filter-card">
        <label htmlFor="status-filter">Order Status Filter</label>

        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(event.target.value as StatusFilter)
          }
        >
          {statusFilters.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? "All" : status}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && orders.length === 0 && (
        <div className="empty-card">No orders found.</div>
      )}

      <div className="admin-order-list">
        {orders.map((order) => {
          const nextStatuses = getNextStatuses(order.status);

          return (
            <div className="admin-order-card" key={order.id}>
              <div className="admin-order-top">
                <div>
                  <h2>Order #{order.id}</h2>
                  <p>Customer: {order.customerName}</p>
                  <p>Order Time: {formatOrderTime(order.orderTime)}</p>
                  <p>Total: ${order.totalPrice.toFixed(2)}</p>
                </div>

                <span
                  className={`status-badge status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>
              </div>

              <h3>Items</h3>

              <table className="admin-order-table">
                <thead>
                  <tr>
                    <th>Meal</th>
                    <th>Quantity</th>
                    <th>Item Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.mealName}</td>
                      <td>{item.quantity}</td>
                      <td>${item.itemPrice.toFixed(2)}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="admin-order-actions">
                {nextStatuses.length === 0 ? (
                  <span className="no-actions">No available actions</span>
                ) : (
                  nextStatuses.map((status) => (
                    <button
                      key={status}
                      disabled={updatingOrderId === order.id}
                      className={
                        status === "CANCELLED" ? "danger-action-btn" : ""
                      }
                      onClick={() => handleUpdateStatus(order.id, status)}
                    >
                      {updatingOrderId === order.id
                        ? "Updating..."
                        : `Set ${status}`}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
import { useState } from "react";
import { getOrderById } from "../api/publicApi";
import type { Order } from "../types";

function OrderQueryPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearchOrder() {
    if (!orderId.trim()) {
      setError("Please enter an order ID.");
      setOrder(null);
      return;
    }

    const id = Number(orderId);

    if (Number.isNaN(id) || id <= 0) {
      setError("Order ID must be a valid number.");
      setOrder(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const orderData = await getOrderById(id);
      setOrder(orderData);
    } catch {
      setError("Order not found or failed to load order details.");
      setOrder(null);
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

  return (
    <div className="page">
      <h1>Order Query</h1>

      <div className="query-card">
        <p className="query-tip">
          Enter your Order ID to check order status and details.
        </p>

        <div className="query-form">
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Enter Order ID"
          />

          <button onClick={handleSearchOrder} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {order && (
        <div className="order-detail-card">
          <div className="order-detail-header">
            <div>
              <h2>Order #{order.id}</h2>
              <p>Customer: {order.customerName}</p>
              <p>Order Time: {formatOrderTime(order.orderTime)}</p>
            </div>

            <span className={`status-badge status-${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <h3>Order Items</h3>

          <table className="order-table">
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

          <div className="order-total">
            Total: ${order.totalPrice.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderQueryPage;
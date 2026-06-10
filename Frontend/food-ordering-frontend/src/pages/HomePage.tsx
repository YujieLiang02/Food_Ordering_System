import { useEffect, useState } from "react";
import { createOrder, getMeals, getMealsByType, getMealTypes } from "../api/publicApi";
import type { CartItem, Meal, MealType } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function HomePage() {
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMealTypeId, setSelectedMealTypeId] = useState("all");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const mealTypeData = await getMealTypes();
        const mealData = await getMeals();

        setMealTypes(mealTypeData);
        setMeals(mealData);
      } catch {
        setError("Failed to load meals. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  async function handleMealTypeChange(value: string) {
    try {
      setSelectedMealTypeId(value);
      setLoading(true);
      setError("");

      if (value === "all") {
        const mealData = await getMeals();
        setMeals(mealData);
      } else {
        const mealData = await getMealsByType(Number(value));
        setMeals(mealData);
      }
    } catch {
      setError("Failed to load meals by category.");
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(imageUrl?: string) {
    if (!imageUrl) {
      return "";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    if (imageUrl.startsWith("/")) {
      return `${API_BASE_URL}${imageUrl}`;
    }

    return `${API_BASE_URL}/${imageUrl}`;
  }

  function addToCart(meal: Meal) {
    setCartItems((currentCart) => {
      const existingItem = currentCart.find((item) => item.mealId === meal.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.mealId === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          mealId: meal.id,
          name: meal.name,
          price: meal.price,
          quantity: 1,
          imageUrl: meal.imageUrl,
        },
      ];
    });
  }

  function increaseQuantity(mealId: number) {
    setCartItems((currentCart) =>
      currentCart.map((item) =>
        item.mealId === mealId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function reduceQuantity(mealId: number) {
    setCartItems((currentCart) =>
      currentCart.map((item) =>
        item.mealId === mealId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  function deleteCartItem(mealId: number) {
    setCartItems((currentCart) =>
      currentCart.filter((item) => item.mealId !== mealId)
    );
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleSubmitOrder() {
    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Please add at least one meal to the cart.");
      return;
    }

    const confirmed = window.confirm(
      `Submit this order? Total price: $${totalPrice.toFixed(2)}`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const newOrder = await createOrder({
        customerName: customerName.trim(),
        items: cartItems.map((item) => ({
          mealId: item.mealId,
          quantity: item.quantity,
        })),
      });

      setCreatedOrderId(newOrder.id);
      setCartItems([]);
      setCustomerName("");
    } catch {
      setError("Failed to submit order. Please try again.");
    }
  }

  if (createdOrderId !== null) {
    return (
      <div className="page">
        <div className="success-card">
          <h1>Order Submitted</h1>
          <p>Your Order ID is:</p>
          <div className="order-success-id">{createdOrderId}</div>

          <button
            className="secondary-btn"
            onClick={() => setCreatedOrderId(null)}
          >
            Start New Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Food Ordering System</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="home-layout">
        <section className="menu-section">
          <div className="section-header">
            <h2>Menu</h2>

            <select
              value={selectedMealTypeId}
              onChange={(event) => handleMealTypeChange(event.target.value)}
            >
              <option value="all">All Categories</option>

              {mealTypes.map((mealType) => (
                <option key={mealType.id} value={mealType.id}>
                  {mealType.name}
                </option>
              ))}
            </select>
          </div>

          {loading && <p>Loading...</p>}

          <div className="meal-grid">
            {meals.map((meal) => (
              <div className="meal-card" key={meal.id}>
                {meal.imageUrl && (
                  <img
                    className="meal-image"
                    src={getImageUrl(meal.imageUrl)}
                    alt={meal.name}
                  />
                )}

                <div className="meal-content">
                  <h3>{meal.name}</h3>

                  <p className="meal-description">
                    {meal.description || "No description"}
                  </p>

                  <p className="meal-category">{meal.mealTypeName}</p>

                  <div className="meal-footer">
                    <span className="meal-price">
                      ${meal.price.toFixed(2)}
                    </span>

                    <button onClick={() => addToCart(meal)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="cart-section">
          <h2>Cart</h2>

          {cartItems.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div className="cart-item" key={item.mealId}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>

                  <div className="cart-actions">
                    <button onClick={() => reduceQuantity(item.mealId)}>
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item.mealId)}>
                      +
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteCartItem(item.mealId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-total">
                Total: ${totalPrice.toFixed(2)}
              </div>

              <div className="order-form">
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Customer name"
                />

                <button className="submit-btn" onClick={handleSubmitOrder}>
                  Submit Order
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export default HomePage;
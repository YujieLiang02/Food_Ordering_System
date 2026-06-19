import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAdminMeal,
  createAdminMealType,
  getAdminMeals,
  getAdminMealTypes,
  uploadMealImage,
} from "../api/adminApi";
import type { Meal, MealType } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AdminMenuPage() {
  const navigate = useNavigate();

  const [token, setToken] = useState("");

  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);

  const [mealTypeName, setMealTypeName] = useState("");
  const [mealTypeDescription, setMealTypeDescription] = useState("");

  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [mealPrice, setMealPrice] = useState("");
  const [mealTypeId, setMealTypeId] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");

    if (!savedToken) {
      navigate("/admin");
      return;
    }

    setToken(savedToken);
    loadMenuData(savedToken);
  }, [navigate]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  async function loadMenuData(adminToken: string) {
    try {
      setLoading(true);
      setError("");

      const [mealList, mealTypeList] = await Promise.all([
        getAdminMeals(adminToken),
        getAdminMealTypes(adminToken),
      ]);

      setMeals(mealList);
      setMealTypes(mealTypeList);
    } catch {
      setError("Failed to load menu data. Please log in again.");
      localStorage.removeItem("adminToken");
      navigate("/admin");
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

  async function handleAddMealType() {
    if (!mealTypeName.trim()) {
      setError("Please enter meal type name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await createAdminMealType(
        {
          name: mealTypeName.trim(),
          description: mealTypeDescription.trim(),
        },
        token
      );

      setMealTypeName("");
      setMealTypeDescription("");
      setMessage("Meal type added successfully.");

      await loadMenuData(token);
    } catch {
      setError("Failed to add meal type.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMeal() {
    if (!mealName.trim()) {
      setError("Please enter meal name.");
      return;
    }

    if (!mealPrice.trim() || Number(mealPrice) <= 0) {
      setError("Please enter a valid meal price.");
      return;
    }

    if (!mealTypeId) {
      setError("Please select a meal type.");
      return;
    }

    if (!imageFile) {
      setError("Please choose a meal image.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const createdMeal = await createAdminMeal(
        {
          name: mealName.trim(),
          description: mealDescription.trim(),
          price: Number(mealPrice),
          mealTypeId: Number(mealTypeId),
        },
        token
      );

      await uploadMealImage(createdMeal.id, imageFile, token);

      setMealName("");
      setMealDescription("");
      setMealPrice("");
      setMealTypeId("");
      setImageFile(null);
      setImagePreviewUrl("");

      setMessage("Meal added successfully.");

      await loadMenuData(token);
    } catch {
      setError("Failed to add meal.");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      setImageFile(null);
      return;
    }

    setError("");
    setImageFile(file);
  }

  return (
    <div className="page">
      <div className="admin-menu-header">
        <div>
          <h1>Admin Menu Management</h1>
          <p>Add meal types and meals with images.</p>
        </div>

        <button onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="admin-menu-layout">
        <section className="admin-menu-section">
          <h2>Add Meal Type</h2>

          <div className="admin-form">
            <label>
              Meal Type Name
              <input
                value={mealTypeName}
                onChange={(event) => setMealTypeName(event.target.value)}
                placeholder="Example: Main Dish"
              />
            </label>

            <label>
              Description
              <textarea
                value={mealTypeDescription}
                onChange={(event) => setMealTypeDescription(event.target.value)}
                placeholder="Example: Hot meals and main dishes"
              />
            </label>

            <button onClick={handleAddMealType} disabled={loading}>
              Add Meal Type
            </button>
          </div>
        </section>

        <section className="admin-menu-section">
          <h2>Add Meal</h2>

          <div className="admin-form">
            <label>
              Meal Name
              <input
                value={mealName}
                onChange={(event) => setMealName(event.target.value)}
                placeholder="Example: Beef Burger"
              />
            </label>

            <label>
              Description
              <textarea
                value={mealDescription}
                onChange={(event) => setMealDescription(event.target.value)}
                placeholder="Example: Beef burger with cheese"
              />
            </label>

            <label>
              Price
              <input
                value={mealPrice}
                onChange={(event) => setMealPrice(event.target.value)}
                placeholder="Example: 12.99"
                type="number"
                min="0"
                step="0.01"
              />
            </label>

            <label>
              Meal Type
              <select
                value={mealTypeId}
                onChange={(event) => setMealTypeId(event.target.value)}
              >
                <option value="">Select meal type</option>
                {mealTypes.map((mealType) => (
                  <option key={mealType.id} value={mealType.id}>
                    {mealType.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Meal Image
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            {imagePreviewUrl && (
              <div className="image-preview-box">
                <p>Image Preview</p>
                <img
                  src={imagePreviewUrl}
                  alt="Meal preview"
                  className="admin-image-preview"
                />
              </div>
            )}

            <button onClick={handleAddMeal} disabled={loading}>
              Add Meal
            </button>
          </div>
        </section>
      </div>

      <section className="admin-menu-section">
        <h2>Current Meal Types</h2>

        {mealTypes.length === 0 ? (
          <p>No meal types found.</p>
        ) : (
          <ul className="admin-simple-list">
            {mealTypes.map((mealType) => (
              <li key={mealType.id}>
                <strong>{mealType.name}</strong>
                {mealType.description && <span> - {mealType.description}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-menu-section">
        <h2>Current Meals</h2>

        {meals.length === 0 ? (
          <p>No meals found.</p>
        ) : (
          <div className="admin-meal-list">
            {meals.map((meal) => (
              <div key={meal.id} className="admin-meal-row">
                <div>
                  <h3>{meal.name}</h3>
                  <p>{meal.description || "No description"}</p>
                  <p>Price: ${meal.price.toFixed(2)}</p>
                  <p>Type: {meal.mealTypeName}</p>
                </div>

                {meal.imageUrl ? (
                  <img
                    src={getImageUrl(meal.imageUrl)}
                    alt={meal.name}
                    className="admin-meal-small-image"
                  />
                ) : (
                  <span className="no-image-text">No image</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminMenuPage;
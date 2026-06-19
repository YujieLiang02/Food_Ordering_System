import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAdminMeal,
  createAdminMealType,
  deleteAdminMeal,
  deleteAdminMealType,
  getAdminMeals,
  getAdminMealTypes,
  updateAdminMeal,
  updateAdminMealType,
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

  const [editingMealTypeId, setEditingMealTypeId] = useState<number | null>(
    null
  );
  const [editMealTypeName, setEditMealTypeName] = useState("");
  const [editMealTypeDescription, setEditMealTypeDescription] = useState("");

  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  const [editMealName, setEditMealName] = useState("");
  const [editMealDescription, setEditMealDescription] = useState("");
  const [editMealPrice, setEditMealPrice] = useState("");
  const [editMealTypeId, setEditMealTypeId] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState("");

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

  useEffect(() => {
    if (!editImageFile) {
      setEditImagePreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(editImageFile);
    setEditImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [editImageFile]);

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

  function handleAddImageChange(event: ChangeEvent<HTMLInputElement>) {
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

  function handleEditImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setEditImageFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      setEditImageFile(null);
      return;
    }

    setError("");
    setEditImageFile(file);
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

  function startEditMealType(mealType: MealType) {
    setEditingMealTypeId(mealType.id);
    setEditMealTypeName(mealType.name);
    setEditMealTypeDescription(mealType.description || "");
    setError("");
    setMessage("");
  }

  function cancelEditMealType() {
    setEditingMealTypeId(null);
    setEditMealTypeName("");
    setEditMealTypeDescription("");
  }

  async function handleUpdateMealType() {
    if (editingMealTypeId === null) {
      return;
    }

    if (!editMealTypeName.trim()) {
      setError("Please enter meal type name.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await updateAdminMealType(
        editingMealTypeId,
        {
          name: editMealTypeName.trim(),
          description: editMealTypeDescription.trim(),
        },
        token
      );

      cancelEditMealType();
      setMessage("Meal type updated successfully.");

      await loadMenuData(token);
    } catch {
      setError("Failed to update meal type.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMealType(mealTypeId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meal type?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteAdminMealType(mealTypeId, token);

      setMessage("Meal type deleted successfully.");
      await loadMenuData(token);
    } catch {
      setError(
        "Failed to delete meal type. Please make sure no meals are using this type."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEditMeal(meal: Meal) {
    setEditingMealId(meal.id);
    setEditMealName(meal.name);
    setEditMealDescription(meal.description || "");
    setEditMealPrice(String(meal.price));
    setEditMealTypeId(String(meal.mealTypeId));
    setEditImageFile(null);
    setEditImagePreviewUrl("");
    setError("");
    setMessage("");
  }

  function cancelEditMeal() {
    setEditingMealId(null);
    setEditMealName("");
    setEditMealDescription("");
    setEditMealPrice("");
    setEditMealTypeId("");
    setEditImageFile(null);
    setEditImagePreviewUrl("");
  }

  async function handleUpdateMeal() {
    if (editingMealId === null) {
      return;
    }

    if (!editMealName.trim()) {
      setError("Please enter meal name.");
      return;
    }

    if (!editMealPrice.trim() || Number(editMealPrice) <= 0) {
      setError("Please enter a valid meal price.");
      return;
    }

    if (!editMealTypeId) {
      setError("Please select a meal type.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await updateAdminMeal(
        editingMealId,
        {
          name: editMealName.trim(),
          description: editMealDescription.trim(),
          price: Number(editMealPrice),
          mealTypeId: Number(editMealTypeId),
        },
        token
      );

      if (editImageFile) {
        await uploadMealImage(editingMealId, editImageFile, token);
      }

      cancelEditMeal();
      setMessage("Meal updated successfully.");

      await loadMenuData(token);
    } catch {
      setError("Failed to update meal.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMeal(mealId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this meal?");

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteAdminMeal(mealId, token);

      setMessage("Meal deleted successfully.");
      await loadMenuData(token);
    } catch {
      setError(
        "Failed to delete meal. This meal may already be used in an order."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="admin-menu-header">
        <div>
          <h1>Admin Menu Management</h1>
          <p>Add, edit, and delete meals and meal types.</p>
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
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImageChange}
              />
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
                {editingMealTypeId === mealType.id ? (
                  <div className="inline-edit-form">
                    <label>
                      Name
                      <input
                        value={editMealTypeName}
                        onChange={(event) =>
                          setEditMealTypeName(event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Description
                      <textarea
                        value={editMealTypeDescription}
                        onChange={(event) =>
                          setEditMealTypeDescription(event.target.value)
                        }
                      />
                    </label>

                    <div className="admin-row-actions">
                      <button onClick={handleUpdateMealType} disabled={loading}>
                        Save
                      </button>

                      <button
                        className="cancel-btn"
                        onClick={cancelEditMealType}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-list-row">
                    <div>
                      <strong>{mealType.name}</strong>
                      {mealType.description && (
                        <span> - {mealType.description}</span>
                      )}
                    </div>

                    <div className="admin-row-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEditMealType(mealType)}
                        disabled={loading}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMealType(mealType.id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
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
                {editingMealId === meal.id ? (
                  <div className="meal-edit-area">
                    <div className="inline-edit-form">
                      <label>
                        Meal Name
                        <input
                          value={editMealName}
                          onChange={(event) =>
                            setEditMealName(event.target.value)
                          }
                        />
                      </label>

                      <label>
                        Description
                        <textarea
                          value={editMealDescription}
                          onChange={(event) =>
                            setEditMealDescription(event.target.value)
                          }
                        />
                      </label>

                      <label>
                        Price
                        <input
                          value={editMealPrice}
                          onChange={(event) =>
                            setEditMealPrice(event.target.value)
                          }
                          type="number"
                          min="0"
                          step="0.01"
                        />
                      </label>

                      <label>
                        Meal Type
                        <select
                          value={editMealTypeId}
                          onChange={(event) =>
                            setEditMealTypeId(event.target.value)
                          }
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
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                        />
                      </label>

                      {editImagePreviewUrl && (
                        <div className="image-preview-box">
                          <p>New Image Preview</p>
                          <img
                            src={editImagePreviewUrl}
                            alt="New meal preview"
                            className="admin-image-preview"
                          />
                        </div>
                      )}

                      <div className="admin-row-actions">
                        <button onClick={handleUpdateMeal} disabled={loading}>
                          Save
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={cancelEditMeal}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3>{meal.name}</h3>
                      <p>{meal.description || "No description"}</p>
                      <p>Price: ${meal.price.toFixed(2)}</p>
                      <p>Type: {meal.mealTypeName}</p>

                      <div className="admin-row-actions">
                        <button
                          className="edit-btn"
                          onClick={() => startEditMeal(meal)}
                          disabled={loading}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteMeal(meal.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
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
                  </>
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
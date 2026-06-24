# Food Ordering System

A full-stack Food Ordering System built with **React + TypeScript** on the frontend and **Spring Boot + MySQL** on the backend.

The project supports customer meal browsing, cart management, order submission, order status query, admin login, admin order management, admin menu management, and meal image upload.

---

## 1. Project Overview

This project is a food ordering web application with two main user roles:

- **Customer**
  - Browse meal categories and meals
  - Add meals to cart
  - Submit an order
  - Receive an order ID
  - Query order status by order ID

- **Admin**
  - Verify admin entry code
  - Log in with admin credentials
  - View and filter customer orders
  - Update order status using valid status transitions
  - Manage meal types
  - Manage meals
  - Upload and change meal images
  - Log out


---

## 2. Tech Stack

### Frontend

- Vite
- React
- TypeScript
- React Router
- Plain CSS

### Backend

- Spring Boot
- Spring Data JPA
- MySQL
- REST APIs
- Multipart image upload

### Database

- MySQL
- Main tables:
  - `meal_types`
  - `meal`
  - `orders`
  - `order_item`

---

## 3. Main Features

### Customer Features

- Display all meal types
- Display all meals
- Filter meals by meal type
- Display meal name, description, price, category, and image
- Add meals to cart
- Increase meal quantity
- Reduce meal quantity
- Delete meal from cart
- Calculate total price on the frontend
- Confirm before submitting order
- Submit order to backend
- Display only the order ID after order submission
- Query order details and status by order ID

### Admin Features

- Admin entry code check
- Admin login
- Admin token saved in `localStorage`
- Protected admin routes
- View all orders
- Filter orders by status
- Update order status
- Valid status action buttons only
- Manage meal types
  - Add meal type
  - Edit meal type
  - Delete meal type
- Manage meals
  - Add meal
  - Edit meal
  - Delete meal
  - Upload meal image
  - Change meal image
  - Preview selected image before submission
- Logout

---

## 4. Routes

| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Customer meal browsing, cart, and order submission |
| `/orders/query` | OrderQueryPage | Customer order query by order ID |
| `/admin` | AdminLoginPage | Admin entry code check and login |
| `/admin/dashboard` | AdminDashboardPage | Admin order management |
| `/admin/menu` | AdminMenuPage | Admin meal and meal type management |

---

## 5. Order Status Rules

The frontend only shows valid action buttons based on the current order status.

| Current Status | Allowed Next Status | Buttons |
|---|---|---|
| `PENDING` | `PREPARING`, `CANCELLED` | Set PREPARING, Set CANCELLED |
| `PREPARING` | `COMPLETED`, `CANCELLED` | Set COMPLETED, Set CANCELLED |
| `COMPLETED` | None | No action buttons |
| `CANCELLED` | None | No action buttons |

---

## 6. Project Structure

A simplified project structure:

```text
Food_Ordering_System/
├── Backend/
│   └── Backend/
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       └── resources/
│       ├── uploads/
│       │   └── meals/
│       └── pom.xml
│
└── Frontend/
    └── food-ordering-frontend/
        ├── src/
        │   ├── api/
        │   │   ├── request.ts
        │   │   ├── publicApi.ts
        │   │   └── adminApi.ts
        │   ├── pages/
        │   │   ├── HomePage.tsx
        │   │   ├── OrderQueryPage.tsx
        │   │   ├── AdminLoginPage.tsx
        │   │   ├── AdminDashboardPage.tsx
        │   │   └── AdminMenuPage.tsx
        │   ├── types/
        │   │   └── index.ts
        │   ├── App.tsx
        │   ├── main.tsx
        │   └── App.css
        ├── .env
        ├── package.json
        └── vite.config.ts
```

---

## 7. Environment Setup

### Frontend `.env`

Create a `.env` file in the frontend root folder:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The frontend uses this environment variable when calling backend APIs.

---

## 8. Database Setup

### MySQL Database

The backend uses MySQL.

Example database name:

```text
Food_Ordering_System
```

Example database configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/Food_Ordering_System
spring.datasource.username=root
spring.datasource.password=123456789
```

Before running the backend, make sure MySQL is running and the database exists.

Example command:

```sql
CREATE DATABASE IF NOT EXISTS Food_Ordering_System;
```

---

## 9. How to Run the Project

### Step 1: Start MySQL

Make sure MySQL is running on your computer.

On Mac, you can check MySQL with:

```bash
mysql -u root -p
```

Then enter your MySQL password.

---

### Step 2: Start the Backend

Go to the backend folder:

```bash
cd Food_Ordering_System/Backend/Backend
```

Run the Spring Boot backend:

```bash
./mvnw spring-boot:run
```

If Mac shows a permission error, run:

```bash
chmod +x mvnw
./mvnw spring-boot:run
```

The backend should run at:

```text
http://localhost:8080
```

---

### Step 3: Start the Frontend

Open a new terminal window.

Go to the frontend folder:

```bash
cd Food_Ordering_System/Frontend/food-ordering-frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

---

## 10. Admin Test Account

### Admin Entry Code

```text
yujie-admin
```

### Admin Login

```text
Username: admin
Password: 123456
```

After successful login, the frontend saves the admin token in `localStorage` with the key:

```text
adminToken
```

---

## 11. API Summary

### Public APIs

| Feature | Method | Path |
|---|---|---|
| Get meal types | GET | `/api/meal-types` |
| Get all meals | GET | `/api/meals` |
| Get meals by type | GET | `/api/meals/type/{mealTypeId}` |
| Create order | POST | `/api/orders` |
| Get order by ID | GET | `/api/orders/{id}` |

### Admin APIs

| Feature | Method | Path |
|---|---|---|
| Check admin entry code | POST | `/api/admin/entry/check` |
| Admin login | POST | `/api/admin/login` |
| Admin logout | POST | `/api/admin/logout` |
| Get all admin orders | GET | `/api/admin/orders` |
| Get orders by status | GET | `/api/admin/orders/status/{status}` |
| Update order status | PATCH | `/api/admin/orders/{id}/status` |
| Get admin meals | GET | `/api/admin/meals` |
| Create meal | POST | `/api/admin/meals` |
| Update meal | PUT | `/api/admin/meals/{id}` |
| Delete meal | DELETE | `/api/admin/meals/{id}` |
| Upload meal image | POST | `/api/admin/meals/{id}/image` |
| Get admin meal types | GET | `/api/admin/meal-types` |
| Create meal type | POST | `/api/admin/meal-types` |
| Update meal type | PUT | `/api/admin/meal-types/{id}` |
| Delete meal type | DELETE | `/api/admin/meal-types/{id}` |

---

## 12. Image Upload Explanation

Meal images are not stored directly in the database.

The image upload process is:

1. Admin selects an image in the frontend.
2. The frontend shows a local preview.
3. The frontend uploads the image using `FormData`.
4. The backend receives the image through `multipart/form-data`.
5. The backend saves the real image file under:

```text
uploads/meals
```

6. The backend saves only the public image path in the database, for example:

```text
/uploads/meals/uuid-image.jpg
```

7. The frontend displays the image by combining:

```text
VITE_API_BASE_URL + imageUrl
```

Example final image URL:

```text
http://localhost:8080/uploads/meals/uuid-image.jpg
```

If the backend is stopped, images cannot be loaded by the browser. However, the uploaded files are still saved on disk. After restarting the backend, the images should display again as long as the `uploads` folder still exists.

---

## 13. Manual Testing Result

Full manual testing has been completed.

### Passed Test Areas

- Customer meal browsing
- Meal type filtering
- Cart add, reduce, and delete
- Order submission
- Order ID display after submission
- Order query by ID
- Admin entry code check
- Admin login
- Admin protected routes
- Admin order list
- Admin order status filtering
- Valid order status transition buttons
- Order status update
- Admin menu management
- Add, edit, and delete meal types
- Add, edit, and delete meals
- Meal image upload
- Meal image preview
- Uploaded image display on customer page
- Image persistence after backend restart
- Admin logout

Current project status:

```text
Core features completed and full manual testing passed.
```

---

## 14. Troubleshooting

### Frontend port is not 5173

The project should use port `5173`.

If the port is already used, stop the old frontend process and run:

```bash
npm run dev
```

### Frontend cannot call backend

Check that the backend is running at:

```text
http://localhost:8080
```

Also check that the frontend `.env` file contains:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Image does not display

Check the database:

```sql
SELECT id, name, image_url FROM meal;
```

Then test the image URL in the browser:

```text
http://localhost:8080/uploads/meals/your-image-name.jpg
```

If the image URL cannot be opened directly, check whether the image file exists in:

```text
Backend/Backend/uploads/meals
```

### Admin status update fails

Make sure the admin token exists in browser `localStorage`.

The admin API requests should include:

```text
Authorization: Bearer <token>
Content-Type: application/json
```

### Cannot delete meal type

If a meal type still has meals under it, deleting it may fail because of database constraints. This is expected behavior.

### Cannot delete meal

If a meal has already appeared in an order, deleting it may fail because order history still references it. This is expected behavior.

---

## 15. Future Improvements

Possible future improvements:

- Add better responsive design for mobile devices
- Add search function for meals
- Add pagination for admin orders
- Add order detail modal in admin dashboard
- Add better image validation and image size display
- Add user authentication for customers
- Add payment simulation
- Add deployment instructions
- Add screenshots to this README

---

## 16. Author

```text
Yujie Liang
```

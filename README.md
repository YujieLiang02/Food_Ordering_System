# Food Ordering System

A full-stack food ordering web application built with **React + TypeScript + Vite** on the frontend and **Spring Boot + MySQL** on the backend.

This project supports customer meal browsing, cart management, order submission, order status query, admin login, admin order management, admin menu management, meal type management, and meal image upload.

---

## 1. Project Overview

This project is designed for a simple restaurant food ordering workflow.

There are two main user roles:

### Customer

Customers can:

- Browse meal categories
- Browse meals with name, description, price, category, and image
- Filter meals by meal type
- Add meals to cart
- Increase or reduce item quantity
- Remove items from cart
- Submit an order
- Receive an order ID after submission
- Query order details and order status by order ID

### Admin

Admins can:

- Verify admin entry code
- Log in with admin credentials
- View all customer orders
- Filter orders by status
- Update order status using valid status transitions
- Manage meal types
- Add, edit, and delete meal types
- Add, edit, and delete meals
- Upload and change meal images
- Preview selected images before submission
- Log out

---

## 2. Tech Stack

### Frontend

- Vite
- React
- TypeScript
- React Router
- Plain CSS
- Fetch API

### Backend

- Java 17
- Spring Boot
- Spring Web / WebMVC
- Spring Data JPA
- Spring Validation
- MySQL
- Lombok
- REST API
- Multipart image upload

### Database

- MySQL

Main database tables include:

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
- Display meal images
- Add meals to cart
- Increase and decrease quantity
- Remove cart items
- Calculate total price
- Submit order
- Show order ID after submission
- Query order status by order ID

### Admin Features

- Admin entry code check
- Admin login
- Admin token stored in `localStorage`
- Protected admin pages
- View all orders
- Filter orders by status
- Update order status
- Manage meal types
- Manage meals
- Upload meal images
- Preview selected images before saving
- Logout

---

## 4. Project Structure

```text
Food_Ordering_System/
├── Backend/
│   └── Backend/
│       ├── src/
│       │   └── main/
│       │       ├── java/
│       │       │   └── com/yujie/backend/
│       │       │       ├── config/
│       │       │       ├── controller/
│       │       │       ├── dto/
│       │       │       ├── entity/
│       │       │       ├── exception/
│       │       │       ├── repository/
│       │       │       └── service/
│       │       └── resources/
│       │           └── application.properties
│       ├── uploads/
│       ├── pom.xml
│       └── mvnw
│
├── Frontend/
│   └── food-ordering-frontend/
│       ├── src/
│       │   ├── api/
│       │   │   ├── request.ts
│       │   │   ├── publicApi.ts
│       │   │   └── adminApi.ts
│       │   ├── pages/
│       │   │   ├── HomePage.tsx
│       │   │   ├── OrderQueryPage.tsx
│       │   │   ├── AdminLoginPage.tsx
│       │   │   ├── AdminDashboardPage.tsx
│       │   │   └── AdminMenuPage.tsx
│       │   ├── types/
│       │   │   └── index.ts
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── App.css
│       ├── .env.example
│       ├── package.json
│       └── vite.config.ts
│
└── README.md
```

---

## 5. Routes

| Route | Page | Description |
|---|---|---|
| `/` | HomePage | Customer meal browsing, cart, and order submission |
| `/orders/query` | OrderQueryPage | Customer order query by order ID |
| `/admin` | AdminLoginPage | Admin entry code check and admin login |
| `/admin/dashboard` | AdminDashboardPage | Admin order management |
| `/admin/menu` | AdminMenuPage | Admin meal and meal type management |

---

## 6. Order Status Rules

The frontend only shows valid action buttons based on the current order status.

| Current Status | Allowed Next Status | Available Buttons |
|---|---|---|
| `PENDING` | `PREPARING`, `CANCELLED` | Set PREPARING, Set CANCELLED |
| `PREPARING` | `COMPLETED`, `CANCELLED` | Set COMPLETED, Set CANCELLED |
| `COMPLETED` | None | No action buttons |
| `CANCELLED` | None | No action buttons |

---

## 7. Environment Setup

### Frontend Environment

Create a `.env` file inside:

```text
Frontend/food-ordering-frontend/
```

You can copy the example file:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The frontend uses this value when calling backend APIs.

### Backend Environment

The backend supports environment variables for database and admin configuration.

Example values:

```bash
export DB_URL="jdbc:mysql://localhost:3306/Food_Ordering_System?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"

export ADMIN_ENTRY_CODE="your_admin_entry_code"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="your_admin_password"
export ADMIN_TOKEN_EXPIRE_MINUTES="120"
```

If environment variables are not provided, the backend will use the default values defined in `application.properties`.

For safety, it is recommended to set your own admin entry code and admin password before running the project.

---

## 8. Database Setup

This project uses MySQL.

Create the database before running the backend:

```sql
CREATE DATABASE IF NOT EXISTS Food_Ordering_System;
```

Then make sure your backend database configuration points to this database.

Example database URL:

```text
jdbc:mysql://localhost:3306/Food_Ordering_System?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

---

## 9. How to Run the Project

### Step 1: Clone the Repository

```bash
git clone https://github.com/YujieLiang02/Food_Ordering_System.git
cd Food_Ordering_System
```

### Step 2: Start MySQL

Make sure MySQL is running.

On Mac, you can test the MySQL connection with:

```bash
mysql -u root -p
```

Then enter your MySQL password.

### Step 3: Start the Backend

Go to the backend folder:

```bash
cd Backend/Backend
```

If needed, give permission to the Maven wrapper:

```bash
chmod +x mvnw
```

Run the Spring Boot backend:

```bash
./mvnw spring-boot:run
```

The backend should run at:

```text
http://localhost:8080
```

### Step 4: Start the Frontend

Open a new terminal window.

Go to the frontend folder:

```bash
cd Frontend/food-ordering-frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend environment file:

```bash
cp .env.example .env
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

## 10. Build Commands

### Frontend Build

```bash
cd Frontend/food-ordering-frontend
npm run build
```

### Frontend Lint

```bash
cd Frontend/food-ordering-frontend
npm run lint
```

### Backend Test

```bash
cd Backend/Backend
./mvnw test
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
2. The frontend shows a local image preview.
3. The frontend uploads the image using `FormData`.
4. The backend receives the file through `multipart/form-data`.
5. The backend saves the real image file under the backend upload folder.
6. The backend saves only the image URL or image path in the database.
7. The frontend displays the image by combining the backend base URL and the saved image path.

Example final image URL:

```text
http://localhost:8080/uploads/meals/example-image.jpg
```

If the backend is stopped, the browser cannot load the image. However, the uploaded file is still saved on disk. After restarting the backend, the image should display again as long as the upload folder still exists.

---

## 13. Manual Testing Result

Full manual testing has been completed.

Passed test areas:

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

### Frontend Cannot Call Backend

Check that the backend is running at:

```text
http://localhost:8080
```

Also check that the frontend `.env` file contains:

```env
VITE_API_BASE_URL=http://localhost:8080
```

After changing `.env`, restart the frontend.

### MySQL Connection Failed

Check:

- MySQL is running
- The database exists
- The username and password are correct
- The backend environment variables are correct

You can test MySQL with:

```bash
mysql -u root -p
```

### Image Does Not Display

Check whether the image path exists in the database:

```sql
SELECT id, name, image_url FROM meal;
```

Then open the image URL directly in the browser:

```text
http://localhost:8080/uploads/meals/your-image-name.jpg
```

If the URL cannot be opened, check whether the image file exists in the backend upload folder.

### Admin Login Failed

Check that you are using the same admin entry code, username, and password configured in your backend environment variables.

Example:

```bash
echo $ADMIN_ENTRY_CODE
echo $ADMIN_USERNAME
echo $ADMIN_PASSWORD
```

### Admin Status Update Failed

Make sure the admin token exists in browser `localStorage`.

Admin API requests should include:

```text
Authorization: Bearer <token>
```

### Cannot Delete Meal Type

If a meal type still has meals under it, deleting it may fail because of database constraints.

This is expected behavior.

### Cannot Delete Meal

If a meal has already appeared in an order, deleting it may fail because order history still references it.

This is expected behavior.

---

## 15. Future Improvements

Possible future improvements:

- Add responsive design for mobile devices
- Add search function for meals
- Add pagination for admin orders
- Add admin order detail modal
- Add better image validation
- Add customer authentication
- Add payment simulation
- Add deployment instructions
- Add screenshots to this README

---

## 16. Author

Yujie Liang

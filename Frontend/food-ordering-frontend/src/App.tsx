import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OrderQueryPage from "./pages/OrderQueryPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/orders/query">Order Query</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders/query" element={<OrderQueryPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/menu" element={<AdminMenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
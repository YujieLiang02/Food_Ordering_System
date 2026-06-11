import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, checkAdminEntryCode } from "../api/adminApi";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [entryCode, setEntryCode] = useState("");
  const [entryPassed, setEntryPassed] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckEntryCode() {
    if (!entryCode.trim()) {
      setError("Please enter the entry code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await checkAdminEntryCode(entryCode.trim());

    if (result.allowed) {
    setEntryPassed(true);
    } else {
      setError(result.message || "Invalid entry code.");
    }
    } catch {
      setError("Failed to check entry code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await adminLogin({
        username: username.trim(),
        password: password.trim(),
      });

      let token = "";

      if (typeof result === "string") {
        token = result;
      } else {
        token = result.token;
      }

      if (!token) {
        setError("Login failed. Token is missing.");
        return;
      }

      localStorage.setItem("adminToken", token);

      navigate("/admin/dashboard");
    } catch {
      setError("Login failed. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Admin Login</h1>

      <div className="admin-login-card">
        {!entryPassed ? (
          <>
            <h2>Entry Code</h2>

            <p className="admin-login-tip">
              Please enter the admin entry code first.
            </p>

            <input
              value={entryCode}
              onChange={(event) => setEntryCode(event.target.value)}
              placeholder="Entry code"
              type="password"
            />

            <button onClick={handleCheckEntryCode} disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </>
        ) : (
          <>
            <h2>Admin Account</h2>

            <p className="admin-login-tip">
              Entry code passed. Please log in with your admin account.
            </p>

            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
            />

            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              type="password"
            />

            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        )}

        {error && <p className="admin-login-error">{error}</p>}
      </div>
    </div>
  );
}

export default AdminLoginPage;
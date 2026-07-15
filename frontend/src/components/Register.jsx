import { useState } from "react";

function Register({ onBackToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ email, password })
      });

      const data = await response.json();

      if (data.message === "Registration successful") {
        setMessage("Registration successful");
        setTimeout(() => {
          onBackToLogin();
        }, 1000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h1 className="login-title">Create Account</h1>

      <p>Create your account to continue</p>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="password-box">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      <button onClick={handleRegister}>
        {loading ? "Creating account..." : "Register"}
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        style={{
          marginTop: "0.75rem",
          background: "transparent",
          color: "#2563eb",
          border: "none",
          cursor: "pointer"
        }}
      >
        Back to Login
      </button>

      {error && <p className="login-error">{error}</p>}
      {message && (
        <p className="login-error" style={{ color: "#16a34a" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Register;

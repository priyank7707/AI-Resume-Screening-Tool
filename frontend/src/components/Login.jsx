import { useState } from "react";

function Login({ setIsLoggedIn }) {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="login-card">

      <h1 className="login-title">
        AI Resume Screening Tool
      </h1>

      <p>Login to Continue</p>

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

      <div className="login-options">

        <label className="remember-me">
          <input type="checkbox" />
            Remember Me
          </label>

      </div>

      <button
        onClick={() => {

          if (
            email === "admin@gmail.com" &&
            password === "admin123"
          ) {

            setError("");
            setLoading(true);

            setTimeout(() => {
              setIsLoggedIn(true);
            }, 1000);

          } else {

            setError("Invalid Email or Password");
        }
      }}
    >
      {loading ? "Logging in..." : "Login"}
    </button>

    {error && (
      <p className="login-error">
        {error}
      </p>
    )}

    </div>
  );
}

export default Login;
"use client";

import { useState } from "react";
import { ChefHat, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (!data.success) {
        setError(data.message);
        return;
      }

      const user = data.user;

      // save user
      localStorage.setItem("user", JSON.stringify(user));

      // redirect by role
      switch (user.role) {
        case "manager":
          window.location.href = `/manager-dashboard/${user._id}`;
          break;

        case "waiter":
          window.location.href = "/waiter-dashboard";
          break;

        case "cook":
          window.location.href = "/cook-dashboard";
          break;
        
        case "admin":
          window.location.href = "/admin-dashboard";
          break;

        default:
          window.location.href = "/";
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: "20px",
          padding: "32px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "#f59e0b",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <ChefHat size={30} color="#000" />
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "5px",
            }}
          >
            Saveur
          </h1>

          <p
            style={{
              color: "#888",
              fontSize: "14px",
            }}
          >
            Restaurant Management System
          </p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              color: "#aaa",
              fontSize: "13px",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              background: "#252525",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "14px",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              color: "#aaa",
              fontSize: "13px",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Password
          </label>

          <div
            style={{
              position: "relative",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                background: "#252525",
                border: `1px solid ${error ? "#ef4444" : "#333"}`,
                borderRadius: "12px",
                padding: "14px 45px 14px 14px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
              }}
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "14px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#888",
                cursor: "pointer",
              }}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "12px",
                marginTop: "8px",
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          style={{
            width: "100%",
            background:
              !email || !password || loading ? "#333" : "#f59e0b",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "15px",
            fontWeight: "600",
            cursor:
              !email || !password || loading
                ? "not-allowed"
                : "pointer",
            transition: "0.2s",
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
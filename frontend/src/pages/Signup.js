import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {Link, useNavigate} from "react-router-dom";
import "../App.css";
import "./Signup.css";
import useGoogleSuccess from "../hooks/useGoogleSuccess";
import { useAuthContext } from "../context/AuthContext";
import Loading from "./Loading";
import BASE_URL from "../utils/config";
import api from "../utils/axiosConfig";


const Signup = () => {
  const handleGoogleSuccess = useGoogleSuccess();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuthContext(); // Get auth state from context

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = (password) => password.length >= 8;

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    // user inputs validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await api.get(`${BASE_URL}/api/auth/csrf/`);
      const response = await api.post(
        `${BASE_URL}/api/auth/signup/`,
        { name, email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      console.log("Signup successful:", response.data);
      navigate("/signup-success");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  // Use effect to redirect authenticated users to home page
  useEffect(() => {
    // Don't redirect until the auth state is determined (loading is false)
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  // Optionally, show a loading indicator if auth check is in progress
  if (loading) {
    return <Loading />
  }

  return (
    <div id="home-container">
      <div className="signup-box">
        <Link to="/">
          <img
            src="/logo.png"
            alt="Welcome Logo"
            className="welcome-image"
          />
        </Link>

        <form className="signup-form" onSubmit={handleSignupSubmit}>
          {error && <p className="error-message">{error}</p>}

          <div className="input-container">
            <input
              type="text"
              placeholder=" "
              className="input-field"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="name"> Username </label>
          </div>

          {/* email input box */}
          <div className="input-container">
            <input
              type="email"
              placeholder=" "
              className="input-field"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          {/* pw input box */}
          <div className="input-container">
            <input
              type="password"
              placeholder=" "
              className="input-field"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          {/* confirm pw */}
          <div className="input-container">
            <input
              type="password"
              placeholder=" "
              className="input-field"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* Google Login */}
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "100%",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Google Signup Failed")}
          />
        </div>

        <p className="login-text">
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

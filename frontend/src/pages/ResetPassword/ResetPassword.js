import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import api from "../../utils/axiosConfig";

const ResetPassword = () => {
  const { uid, token } = useParams(); // Extract user ID and token from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const isValidPassword = (password) => password.length >= 8;

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    try {
        const response = await api.post(
            "http://localhost:8000/api/auth/reset-password-confirm/", 
            { uid, token, new_password: password }, 
            { headers: {
                "Content-Type": "application/json" } }
        );

        console.log("Password reset successful:", response.data);
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000); 
    } catch (error) {
        console.error("Password reset failed:", error.response?.data || error);
        setError(error.response?.data?.message || "Reset failed. Try again.");
    }
};


  return (
    <div id="home-container">
      <div className="signup-box">
        <h2 className="rpw-title">Reset Your Password</h2>

        {success ? (
          <p className="success-message">Password reset successful! Redirecting to login...</p>
        ) : (
          <form className="signup-form" onSubmit={handleResetSubmit}>
            {error && <p className="error-message">{error}</p>}

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
              <label htmlFor="password">New Password</label>
            </div>

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
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;


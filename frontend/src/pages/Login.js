import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import useGoogleSuccess from "../hooks/useGoogleSuccess";
import { useAuthContext } from "../context/AuthContext";
import "./Login.css";
import "../App.css";
import Loading from "./Loading";
import BASE_URL from "../utils/config";
import api from "../utils/axiosConfig";


function Login() {
  const handleGoogleSuccess = useGoogleSuccess();
  const navigate = useNavigate();
  const { isAuthenticated, loading, refreshAuth } = useAuthContext(); // Get auth state from context

  // Local state for form data and UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Store error messages
  const [loadingLocal, setLoadingLocal] = useState(false); // For preventing multiple requests
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState(""); // Store reset email
  const [resetMessage, setResetMessage] = useState(""); // Store reset success/error message

  // If authentication status is determined and the user is authenticated, redirect to the dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
        navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  // Optional: Show a loading indicator while checking auth state
  if (loading) {
    return <Loading />;
  }

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };


  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Regular Expression to Validate Email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoadingLocal(true);

    try {
      await api.post(
        `${BASE_URL}/api/auth/login/`,
        { email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
       await refreshAuth();
       navigate("/");
    } catch (error) {
    if (error.response) {
      // Handle HTTP error status codes
      switch (error.response.status) {
        case 401:
          // Check backend's specific error message
          const backendError = error.response.data?.error?.toLowerCase();

          if (backendError.includes("account with this email does not exist")) {
            setError("Account not found. Please check your email address.");
          } else if (backendError.includes("incorrect password")) {
            setError("Wrong password. Please try again.");
          } else if (backendError.includes("account is disabled")) {
            setError("Account disabled. Contact support.");
          } else {
            setError("Invalid credentials. Please try again.");
          }
          break;

        case 400:
          setError("Invalid request. Please check your input.");
          break;

        case 500:
          setError("Server error. Please try again later.");
          break;

        default:
          setError("Something went wrong. Please try again.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      setError("Network error. Please check your internet connection.");
    } else {
      // Something happened in setting up the request
      setError("Request setup error. Please try again.");
    }
  } finally {
    setLoadingLocal(false);
  }
  };




// Function for handling password reset
    const handleResetPassword = async () => {
        setResetMessage("");  

        if (!resetEmail.trim()) {
            setResetMessage("Please enter your email.");
            return;
        }

        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(resetEmail.trim())) {
            setResetMessage("Please enter a valid email address.");
            return;
        }
         //clear previous request before making new request
        setResetMessage("Processing reset password request...");
        try {
            const response = await api.post(`${BASE_URL}/api/auth/reset/`, { email: resetEmail.trim() });
            if (response.status === 200) {
                setResetMessage("If your account exists, a reset link has been sent to your email.");
                setTimeout(() => setIsModalOpen(false), 2000); // after the reset is successful modal closes 
            } else {
                setResetMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                setResetMessage(error.response.data?.message || "Failed to send reset email. Please try again.");
            } else {
                setResetMessage("Network error. Please check your connection and try again.");
            }
        }
    };

  return (
    <div id="home-container">
      <div className="login-box">

        <Link to="/">
          <img
            src="/logo.png"
            alt="Welcome Logo"
            className="welcome-image"
          />
        </Link>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Email/Password Login Form */}
        <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="input-container">
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="input-container">
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot Password?
          </p>

          <button type="submit" className="login-btn" disabled={loadingLocal}>
            {loadingLocal ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
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

        {/* Sign Up Link */}
        <p className="signup-text" id="movemessage">
          Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
        </p>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
          <button className="close" onClick={() => setIsModalOpen(false)}>
  &times;
</button>

            <h2>Forgot Password?</h2>
            <p>Enter your email below and we'll send you a link to reset your password.</p>

            <div className="input-container">
              <input
                type="email"
                id="reset-email"
                className="input-field"
                placeholder=" "
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <label htmlFor="reset-email">Email address</label>
            </div>

            <button className="reset-btn" onClick={handleResetPassword}>
              Get Reset Link
            </button>
            <p className="reset-message">{resetMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

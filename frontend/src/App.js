import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SignupSuccess from "./pages/SignupSucess"
import Home from "./pages/Home"
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import api from "./utils/axiosConfig";
import BASE_URL from "./utils/config";

const clientId = process.env.REACT_APP_CLIENT_ID;// Replace with actual Client ID
console.log("BASE_URL:", process.env.REACT_APP_API_URL);
function App() {
      useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await api.get(`${BASE_URL}/api/auth/csrf/`);
        const csrfToken = response.data.csrfToken;
        api.defaults.headers.common['X-CSRFToken'] = csrfToken;
        console.log("✅ CSRF token set:", csrfToken);
      } catch (error) {
        console.error("❌ Failed to fetch CSRF token:", error);
      }
    };

    fetchCSRFToken();
  }, []);



    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signin" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup-success" element={<SignupSuccess />} />
                    <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
                    <Route path="*" element={<h1>Page Not Found</h1>} /> {/* Catch-all for unknown routes */}
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;

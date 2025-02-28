import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../App.css";

function Login() {
   const navigate = useNavigate();

   const handleLoginClick = (event) => {
       event.preventDefault();
       navigate("/login");
   };

   return (
       <div className="home-container">
           <div className="login-box">
               <img src="/logo.png" alt="Welcome Logo" className="welcome-image" />

               <form className="login-form">

                   <input type="email" placeholder="Enter your email" className="input-field"/>


                   <label className="usernamepass">
                       <input type="password" placeholder="Enter your password" className="input-field"/>
                       {/* Login Button */}
                   </label>

                   <button type="submit" className="login-btn" onClick={handleLoginClick}>
                       Login
                   </button>
               </form>

               <div className="divider">
                   <span>OR</span>
               </div>

               <button className="google-btn">
                   <img src="/G.webp" alt="Google Logo" className="google-logo" />
                   Continue with Google
               </button>
               {/* Signup Link */}
               <p className="signup-text">
                   Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
               </p>
           </div>

           <p className="footer-text">React + Django Integration</p>
       </div>
   );
}

export default Login;

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LogOut from "../../components/Auth/LogOut";
const SignupSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshAuth } = useAuthContext();
    const user = location.state?.user || { first_name: "User", last_name: "" };

    return (
        <div className="success-container">
            <div className="success-box">
                <img src="/success-icon.png" alt="Success" className="success-icon"/>
                <h1>Signup Successful!</h1>
                <p>Welcome to our platform, {user.first_name}</p>

                <LogOut />


                <button className="home-btn" onClick={() => {
                    refreshAuth();
                    navigate("/");
                }}>
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default SignupSuccess;

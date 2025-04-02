import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from '../../utils/config';
import {getCookie} from "../../utils/utils";
import api from "../../utils/axiosConfig";

const LogOut = () => {
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      // Call the logout endpoint on your backend.
      await api.post(
        `${BASE_URL}/api/auth/logout/`,
        {},
        { withCredentials: true, headers: {
        'Content-Type': 'application/json', // Optional but good practice
      },}
      );
      // After a successful logout, redirect to login for now
      navigate("/login");

      //if (location.pathname === "/") {
        // If already at home, force a reload so that context updates.
        window.location.reload();
     // } else {
        // Otherwise, navigate to home.
       // navigate("/");
     // }
   } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="custom-google-btn">
      Logout
    </button>
  );
};

export default LogOut;

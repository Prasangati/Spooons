import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from '../../utils/config';


const LogOut = () => {
  const navigate = useNavigate();
  //const location = useLocation();

  const handleLogout = async () => {
    try {
      // Call the logout endpoint on your backend.
      await axios.post(
        `${BASE_URL}/api/auth/logout/`,
        {},
        { withCredentials: true }
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

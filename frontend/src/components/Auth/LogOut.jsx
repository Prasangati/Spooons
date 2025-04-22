import { useNavigate } from "react-router-dom";
import BASE_URL from '../../utils/config';
import api from "../../utils/axiosConfig";

const LogOut = () => {
  const navigate = useNavigate();


  const handleLogout = async () => {
      try {
        const refresh = localStorage.getItem("refresh");

        await api.post(
          `${BASE_URL}/api/auth/logout/`,
          { refresh }, // send refresh token to blacklist
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.warn("Server logout failed or already logged out");
      } finally {
        // Always clear frontend tokens
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
  }
    };

  return (
    <button onClick={handleLogout} className="custom-google-btn">
      Logout
    </button>
  );
};

export default LogOut;

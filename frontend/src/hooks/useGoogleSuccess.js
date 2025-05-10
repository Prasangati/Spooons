// useGoogleSuccess.js
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import BASE_URL from "../utils/config";
import api from "../utils/axiosConfig";

const useGoogleSuccess = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuthContext();

  return async (response) => {
    console.log("Google OAuth Response:", response);

    if (document.hasStorageAccess && !(await document.hasStorageAccess())) {
      try {
        await document.requestStorageAccess();
        console.log("✅ Storage access granted.");
      } catch (err) {
        console.warn("❌ Storage access denied:", err);
      }
    }

    try {
      if (!response.credential) {
        console.error("No ID token received from Google");
        return;
      }

      const res = await api.post(
        `${BASE_URL}/api/auth/google-signup/`,
        { token: response.credential },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      const { access, refresh } = res.data.tokens || {};
      const user = res.data.user;

      if (access && refresh) {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user", JSON.stringify(user));
      }

      console.log("Signup successful:", res.data);

      await refreshAuth(); // Updates auth context after setting tokens
      navigate("/", { replace: true });

    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
    }
  };
};

export default useGoogleSuccess;


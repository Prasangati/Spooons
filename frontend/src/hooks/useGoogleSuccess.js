// useGoogleSuccess.js
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../context/AuthContext";
import BASE_URL from "../utils/config";
import api from "../utils/axiosConfig";
import {getCookie} from "../utils/utils";

const useGoogleSuccess = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuthContext();


  return async (response) => {
    console.log("Google OAuth Response:", response);
    try {
      if (!response.credential) {
        console.error("No ID token received from Google");
        return;
      }
      const res = await api.post(
          `${BASE_URL}/api/auth/google-signup/`,
          {token: response.credential},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json"},
          }
      );

      console.log("Signup successful:", res.data);
      await refreshAuth();
      navigate("/", {state: {user: res.data.user}});
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
    }
  };
};

export default useGoogleSuccess;

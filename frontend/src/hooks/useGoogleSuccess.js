// useGoogleSuccess.js
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../context/AuthContext";
import BASE_URL from "../utils/config";
import { useContext } from "react";
import api from "../utils/axiosConfig";
import  { CSRFContext } from "../utils/CSRFContext";


const useGoogleSuccess = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuthContext();
  const { refreshCSRF } = useContext(CSRFContext);


  return async (response) => {
    console.log("Google OAuth Response:", response);
    if (document.hasStorageAccess && !(await document.hasStorageAccess())) {
    try {
      await document.requestStorageAccess();
      console.log("✅ Storage access granted.");
    } catch (err) {
      console.warn("❌ Storage access denied:", err);
      // You can choose to show a user-friendly message here if you want.
    }
    }


    try {
      if (!response.credential) {
        console.error("No ID token received from Google");
        return;
      }
      await api.get(`${BASE_URL}/api/auth/csrf/`);
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
      await refreshCSRF();
      navigate("/", {state: {user: res.data.user}});
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
    }
  };
};

export default useGoogleSuccess;

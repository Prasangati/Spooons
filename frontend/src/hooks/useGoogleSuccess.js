// useGoogleSuccess.js
import {useNavigate} from "react-router-dom";
import axios from "axios";

const useGoogleSuccess = () => {
  const navigate = useNavigate();

  return async (response) => {
    console.log("Google OAuth Response:", response);
    try {
      if (!response.credential) {
        console.error("No ID token received from Google");
        return;
      }
      const res = await axios.post(
          "http://localhost:8000/api/auth/google-signup/",
          {token: response.credential},
          {
            withCredentials: true,
            headers: {"Content-Type": "application/json"},
          }
      );

      console.log("Signup successful:", res.data);
      navigate("/signup-success", {state: {user: res.data.user}});
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error);
    }
  };
};

export default useGoogleSuccess;

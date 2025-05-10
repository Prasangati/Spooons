import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../utils/config';
import api from "../../utils/axiosConfig";

const CustomGoogleButton = () => {
  const navigate = useNavigate();

  // In your React component
const handleGoogleSuccess = async (tokenResponse) => {
  try {
    const res = await api.post(
        `${BASE_URL}/api/auth/google-signup/`,
      {
        id_token: tokenResponse.id_token  // Send ID token instead of access_token
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json" },
      }
    );

    const { tokens, user } = res.data || {};
    const { access, refresh } = tokens || {};

    if (access && refresh) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
    }

    navigate("/", { replace: true });
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error);
  }
};

const login = useGoogleLogin({
  onSuccess: handleGoogleSuccess,
  flow: 'implicit',
  scope: 'openid profile email'  // Must include 'openid'
});



  return (
    <button onClick={login} className="custom-google-btn">
      Sign Up with Google
    </button>
  );
};

export default CustomGoogleButton;
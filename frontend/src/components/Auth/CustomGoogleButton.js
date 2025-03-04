import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomGoogleButton = () => {
  const navigate = useNavigate();

  // In your React component
const handleGoogleSuccess = async (tokenResponse) => {
  try {
    const res = await axios.post(
      "http://localhost:8000/api/auth/google-signup/",
      {
        id_token: tokenResponse.id_token  // Send ID token instead of access_token
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    navigate("/signup-success");
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
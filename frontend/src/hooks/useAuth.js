import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "../utils/config";

// useAuth.js (or within your AuthContext provider)
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/me/`, { withCredentials: true });
      if (res.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(res.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      console.log("Message from useauthcontext: ", isAuthenticated);
    } catch (err) {
      setError(err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, user, loading, error, refreshAuth: checkAuth };
};

export default useAuth;

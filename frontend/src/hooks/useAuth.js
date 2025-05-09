import { useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import BASE_URL from '../utils/config';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = async () => {
  const token = localStorage.getItem("access");

  if (!token) {
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false); // ✅ prevent infinite loading
    return;
  }

  try {
    const res = await api.get(`${BASE_URL}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setIsAuthenticated(true);
    setUser(res.data.user);
  } catch (err) {
    setIsAuthenticated(false);
    setUser(null);
  } finally {
    setLoading(false); // ✅ important to run no matter what
  }
};



  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    refreshAuth: checkAuth,
  };
};

export default useAuth;


import React, { createContext, useEffect } from 'react';
import api from "./axiosConfig";


export const CSRFContext = createContext();

export const CSRFProvider = ({ children }) => {
  useEffect(() => {
    const fetchCSRF = async () => {
      try {
        const response = await api.get('/api/auth/csrf/');
        const token = response.data.csrfToken;
        api.defaults.headers.common['X-CSRFToken'] = token;
        console.log("✅ CSRF token set globally:", token);
      } catch (err) {
        console.error("❌ Failed to fetch CSRF token:", err);
      }
    };
    fetchCSRF();
  }, []);

  return children;
};
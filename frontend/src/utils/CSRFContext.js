import { createContext, useEffect } from 'react';
import api from "./axiosConfig";
import BASE_URL from "./config";


export const CSRFContext = createContext();

const CSRFProvider = ({ children }) => {
  const fetchCSRFToken = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/auth/csrf/`);
      const csrfToken = response.data.csrfToken;
      api.defaults.headers.common["X-CSRFToken"] = csrfToken;
      console.log("CSRF token set globally:", csrfToken);
    } catch (err) {
      console.error(" Failed to fetch CSRF token:", err);
    }
  };

  useEffect(() => {
    fetchCSRFToken();
  }, []);

  return (
    <CSRFContext.Provider value={{ refreshCSRF: fetchCSRFToken }}>
      {children}
    </CSRFContext.Provider>
  );
};

export default CSRFProvider;
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // this ensures cookies (including csrf) are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = config.headers['X-CSRFToken'];
  console.log("🔁 Axios Request Method:", config.method);
  console.log("📎 CSRF Token on request:", token);
  return config;
});

export default api;

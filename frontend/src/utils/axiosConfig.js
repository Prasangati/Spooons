import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // this ensures cookies (including csrf) are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase?.() || '';
  const token = config.headers['X-CSRFToken']; // comes from App.js

  console.log("Request method:", method);
  console.log("Token already set on config:", token);

  return config;
});

export default api;

import axios from 'axios';
import {isTokenExpired, refreshAccessToken} from './tokenUtils';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('access');

  if (isTokenExpired(token)) {
    console.log("Access token expired. Refreshing...");
    token = await refreshAccessToken();
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

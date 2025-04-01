// axiosConfig.js
import axios from 'axios';
import {getCookie} from "./utils";// or wherever your getCookie is

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  const method = config.method.toLowerCase();

  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    config.headers['X-CSRFToken'] = csrfToken;
  }

  return config;
});

export default api;

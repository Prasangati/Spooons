import axios from 'axios';
import { getCookie } from './utils'; // or wherever you store it

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const csrfToken = getCookie('csrftoken');
  const method = config.method?.toLowerCase?.() || '';

  console.log("csrftoken from cookie:", csrfToken);
  console.log("Request method:", method);

  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    config.headers['X-CSRFToken'] = csrfToken;
    console.log("Attached CSRF token to headers:", csrfToken);
  }

  return config;
});

export default api;

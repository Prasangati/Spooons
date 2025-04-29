import { jwtDecode } from 'jwt-decode';
import api from './axiosConfig';
// Check if token is expired
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    const now = Date.now() / 1000;
    return exp < now;
  } catch (error) {
    return true;
  }
}

// Attempt to refresh access token


export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;

  try {
    const res = await api.post('/api/auth/token/refresh/', { refresh });
    const newAccess = res.data.access;
    if (newAccess) {
      localStorage.setItem('access', newAccess);
      return newAccess;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
}

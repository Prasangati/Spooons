import {jwtDecode} from "jwt-decode";

export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    return !exp || (exp * 1000 < Date.now());
  } catch (err) {
    return true;
  }
}

export async function refreshAccessToken() {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      throw new Error('Refresh token invalid');
    }

    const data = await response.json();

    //  Save new tokens
    const { access, refresh: newRefresh } = data;
    localStorage.setItem("access", access);
    if (newRefresh) {
      localStorage.setItem("refresh", newRefresh);
    }

    return access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    return null;
  }
}

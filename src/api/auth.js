const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "auth_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const request = async (path, { method = "GET", body, token } = {}) => {
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      data?.error || data?.message || "Something went wrong. Try again.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
};

const register = ({ email, password }) =>
  request("/auth/register", {
    method: "POST",
    body: { email, password },
  });

const login = ({ email, password }) =>
  request("/auth/login", {
    method: "POST",
    body: { email, password },
  });

const fetchMe = (token) =>
  request("/auth/me", {
    method: "GET",
    token,
  });

const logout = () => {
  clearToken();
};

export { register, login, fetchMe, getToken, setToken, clearToken, logout };

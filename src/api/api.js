const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:3000");
const TOKEN_KEY = "auth_token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const request = async (
  path,
  { method = "GET", body, auth = false, token } = {}
) => {
  const headers = { "Content-Type": "application/json" };
  const authToken = token || (auth ? getToken() : null);

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
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

export { API_BASE_URL, getToken, setToken, clearToken, request };

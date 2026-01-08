import { request, setToken, clearToken, getToken } from "./api.js";

const register = ({ name, email, password }) =>
  request("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

const login = ({ email, password }) =>
  request("/auth/login", {
    method: "POST",
    body: { email, password },
  });

const fetchMe = (token) =>
  request("/auth/me", {
    method: "GET",
    token: token || getToken(),
  });

const logout = () => {
  clearToken();
};

export { register, login, fetchMe, getToken, setToken, clearToken, logout };

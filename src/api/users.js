import { request } from "./api.js";

const listUsers = () => request("/users", { auth: true });

export { listUsers };

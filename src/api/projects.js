import { request } from "./api.js";

const listProjects = () => request("/projects", { auth: true });

const createProject = (name) =>
  request("/projects", {
    method: "POST",
    auth: true,
    body: { name },
  });

const getProject = (projectId) =>
  request(`/projects/${projectId}`, { auth: true });

const deleteProject = (projectId) =>
  request(`/projects/${projectId}`, { method: "DELETE", auth: true });

const assignUserToProject = (projectId, userId) =>
  request(`/projects/${projectId}/users`, {
    method: "POST",
    auth: true,
    body: { userId },
  });

const removeUserFromProject = (projectId, userId) =>
  request(`/projects/${projectId}/users/${userId}`, {
    method: "DELETE",
    auth: true,
  });

const listProjectUsers = (projectId) =>
  request(`/projects/${projectId}/users`, { auth: true });

export {
  listProjects,
  createProject,
  getProject,
  deleteProject,
  assignUserToProject,
  removeUserFromProject,
  listProjectUsers,
};

import { request } from "./api.js";

const listTasks = (projectId) =>
  request(`/projects/${projectId}/tasks`, { auth: true });

const createTask = (projectId, title, description) =>
  request(`/projects/${projectId}/tasks`, {
    method: "POST",
    auth: true,
    body: { title, description },
  });

const updateTaskStatus = (taskId, status) =>
  request(`/tasks/${taskId}/status`, {
    method: "PATCH",
    auth: true,
    body: { status },
  });

const addTimeEntry = (taskId, minutes) =>
  request(`/tasks/${taskId}/time-entries`, {
    method: "POST",
    auth: true,
    body: { minutes },
  });

const updateTimeEntry = (entryId, minutes) =>
  request(`/tasks/time-entries/${entryId}`, {
    method: "PATCH",
    auth: true,
    body: { minutes },
  });

const updateTaskDescription = (taskId, description) =>
  request(`/tasks/${taskId}/description`, {
    method: "PATCH",
    auth: true,
    body: { description },
  });

const addTaskItem = (taskId, content) =>
  request(`/tasks/${taskId}/items`, {
    method: "POST",
    auth: true,
    body: { content },
  });

const updateTaskItem = (itemId, payload) =>
  request(`/tasks/items/${itemId}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });

const deleteTaskItem = (itemId) =>
  request(`/tasks/items/${itemId}`, {
    method: "DELETE",
    auth: true,
  });

const deleteTask = (taskId) =>
  request(`/tasks/${taskId}`, {
    method: "DELETE",
    auth: true,
  });

export {
  listTasks,
  createTask,
  updateTaskStatus,
  addTimeEntry,
  updateTimeEntry,
  updateTaskDescription,
  addTaskItem,
  updateTaskItem,
  deleteTaskItem,
  deleteTask,
};

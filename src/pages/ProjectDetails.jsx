import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout.jsx";
import TaskItem from "../components/TaskItem.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import WysiwygEditor, { sanitizeHtml } from "../components/WysiwygEditor.jsx";
import { getProject } from "../api/projects.js";
import {
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
} from "../api/tasks.js";

const ProjectDetails = ({ user, onLogout }) => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadProject = async () => {
    setLoading(true);
    setError("");

    try {
      const [projectData, tasksData] = await Promise.all([
        getProject(id),
        listTasks(id),
      ]);
      setProject(projectData.project);
      setTasks(tasksData.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await createTask(id, title, sanitizeHtml(description));
      setTasks((prev) => [{ ...data.task, items: [] }, ...prev]);
      setTitle("");
      setDescription("");
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setError("");

    try {
      const data = await updateTaskStatus(taskId, status);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...data.task, items: task.items } : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRequest = (taskId) => {
    const target = tasks.find((task) => task.id === taskId);
    if (!target) {
      return;
    }
    setDeleteTarget(target);
    setIsDeleteOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) {
      return;
    }
    setError("");

    try {
      await deleteTask(deleteTarget.id);
      setTasks((prev) =>
        prev.filter((task) => task.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
      setIsDeleteOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTimeEntry = async (taskId, value) => {
    setError("");

    try {
      const data = await addTimeEntry(taskId, value);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                time_spent_minutes: data.totalMinutes,
                time_entries: [data.entry, ...(task.time_entries || [])],
              }
            : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTimeEntry = async (entryId, value) => {
    setError("");

    try {
      const data = await updateTimeEntry(entryId, value);
      setTasks((prev) =>
        prev.map((task) => {
          const entries = task.time_entries || [];
          if (!entries.some((entry) => entry.id === entryId)) {
            return task;
          }
          return {
            ...task,
            time_spent_minutes: data.totalMinutes,
            time_entries: entries.map((entry) =>
              entry.id === entryId ? data.entry : entry
            ),
          };
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDescriptionChange = async (taskId, value) => {
    setError("");

    try {
      const data = await updateTaskDescription(taskId, value);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, description: data.task.description }
            : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddItem = async (taskId, content) => {
    setError("");

    try {
      const data = await addTaskItem(taskId, content);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, items: [data.item, ...(task.items || [])] }
            : task
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateItem = async (itemId, payload) => {
    setError("");

    try {
      const data = await updateTaskItem(itemId, payload);
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          items: (task.items || []).map((item) =>
            item.id === itemId ? data.item : item
          ),
        }))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    setError("");

    try {
      await deleteTaskItem(itemId);
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          items: (task.items || []).filter((item) => item.id !== itemId),
        }))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const totalMinutes = tasks.reduce(
    (sum, task) => sum + Number(task.time_spent_minutes || 0),
    0
  );

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <section className="panel panel--split">
        <div>
          <Link className="panel__link" to="/projects">
            Back to projects
          </Link>
          <h2>{project?.name || "Project"}</h2>
          <p>
            Manage tasks and track project momentum. Total time: {totalMinutes}{" "}
            min.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add task</Button>
      </section>

      {error ? <div className="panel__error">{error}</div> : null}

      {loading ? (
        <p className="panel__muted">Loading project...</p>
      ) : (
        <section className="task-list">
          {tasks.length ? (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onTimeAdd={handleAddTimeEntry}
                onTimeEntryUpdate={handleUpdateTimeEntry}
                onDescriptionChange={handleDescriptionChange}
                onItemAdd={handleAddItem}
                onItemUpdate={handleUpdateItem}
                onItemDelete={handleDeleteItem}
                canEditDescription={
                  user?.role === "ADMIN" ||
                  Number(task.created_by) === Number(user?.id)
                }
                canEditTimeEntries={user?.role === "ADMIN"}
                canDelete={
                  user?.role === "ADMIN" ||
                  Number(task.created_by) === Number(user?.id)
                }
                onDelete={handleDeleteRequest}
              />
            ))
          ) : (
            <p className="panel__muted">No tasks yet. Add the first one.</p>
          )}
        </section>
      )}

      <Modal
        isOpen={isModalOpen}
        title="Create task"
        className="modal--wide"
        onClose={() => setIsModalOpen(false)}
        footer={
          <Button type="submit" form="create-task-form">
            Create task
          </Button>
        }
      >
        <form id="create-task-form" onSubmit={handleCreateTask}>
          <Input
            id="task-title"
            name="taskTitle"
            label="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Design review"
            required
          />
          <label className="input-field" htmlFor="task-description">
            <span>Description</span>
            <WysiwygEditor
              value={description}
              onChange={setDescription}
              placeholder="Optional details or notes"
            />
          </label>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        title="Delete task"
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTarget(null);
        }}
        footer={
          <div className="modal__actions">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTask}>
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{deleteTarget?.title}</strong>?
        </p>
      </Modal>
    </DashboardLayout>
  );
};

export default ProjectDetails;

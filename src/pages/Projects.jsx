import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";
import { listProjects, createProject, deleteProject } from "../api/projects.js";
import { listTasks } from "../api/tasks.js";

const Projects = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listProjects();
      setProjects(data.projects);

      const tasksResults = await Promise.all(
        data.projects.map((project) =>
          listTasks(project.id).catch(() => ({ tasks: [] }))
        )
      );

      const tasksMap = {};
      data.projects.forEach((project, index) => {
        tasksMap[project.id] = tasksResults[index].tasks || [];
      });
      setProjectTasks(tasksMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await createProject(name);
      setProjects((prev) => [data.project, ...prev]);
      setProjectTasks((prev) => ({ ...prev, [data.project.id]: [] }));
      setName("");
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (projectId) => {
    setError("");

    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      setProjectTasks((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <section className="panel panel--split">
        <div>
          <h2>Projects</h2>
          <p>Create, track, and maintain visibility across teams.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>New project</Button>
      </section>

      {error ? <div className="panel__error">{error}</div> : null}

      <section className="project-grid">
        {loading ? (
          <p className="panel__muted">Loading projects...</p>
        ) : projects.length ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canDelete={user?.role === "ADMIN" || project.owner_id === user?.id}
              onDelete={handleDelete}
              tasksPreview={projectTasks[project.id] || []}
            />
          ))
        ) : (
          <p className="panel__muted">No projects yet.</p>
        )}
      </section>

      <Modal
        isOpen={isModalOpen}
        title="Create new project"
        onClose={() => setIsModalOpen(false)}
        footer={
          <Button type="submit" form="create-project-form">
            Create project
          </Button>
        }
      >
        <form id="create-project-form" onSubmit={handleCreate}>
          <Input
            id="project-name"
            name="projectName"
            label="Project name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Launch roadmap"
            required
          />
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Projects;

import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import Button from "../components/Button.jsx";
import {
  listProjects,
  assignUserToProject,
  removeUserFromProject,
  listProjectUsers,
} from "../api/projects.js";
import { listUsers } from "../api/users.js";

const Admin = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const [projectsData, usersData] = await Promise.all([
          listProjects(),
          listUsers(),
        ]);
        setProjects(projectsData.projects);
        setUsers(usersData.users);

        const assignmentsData = await Promise.all(
          projectsData.projects.map((project) =>
            listProjectUsers(project.id).catch(() => ({ users: [] }))
          )
        );

        const mapped = {};
        projectsData.projects.forEach((project, index) => {
          mapped[project.id] = assignmentsData[index].users || [];
        });
        setProjectUsers(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleAssign = async (event, projectId) => {
    event.preventDefault();
    setError("");

    try {
      const userId = selectedUser[projectId];
      if (!userId) {
        setError("Select a user to assign.");
        return;
      }
      await assignUserToProject(projectId, userId);
      const assignedUser = users.find(
        (candidate) => String(candidate.id) === String(userId)
      );
      setProjectUsers((prev) => ({
        ...prev,
        [projectId]: [
          assignedUser
            ? {
                id: assignedUser.id,
                name: assignedUser.name,
                email: assignedUser.email,
                role: assignedUser.role,
              }
            : { id: Number(userId), name: "Unknown", email: "Unknown", role: "USER" },
          ...(prev[projectId] || []),
        ],
      }));
      setSelectedUser((prev) => ({ ...prev, [projectId]: "" }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (projectId, userId) => {
    setError("");

    try {
      await removeUserFromProject(projectId, userId);
      setProjectUsers((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] || []).filter(
          (assigned) => assigned.id !== userId
        ),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <section className="panel">
        <div>
          <h2>Admin panel</h2>
          <p>Assign users to projects and manage access.</p>
        </div>
      </section>

      {error ? <div className="panel__error">{error}</div> : null}

      <section className="admin-grid">
        {loading ? (
          <p className="panel__muted">Loading projects...</p>
        ) : projects.length ? (
          projects.map((project) => (
            <div key={project.id} className="admin-card">
              <div>
                <h3>{project.name}</h3>
                <p>Project ID: {project.id}</p>
              </div>
              <form
                className="admin-card__form"
                onSubmit={(event) => handleAssign(event, project.id)}
              >
                <label className="input-field" htmlFor={`assign-${project.id}`}>
                  <span>Assign user</span>
                  <select
                    id={`assign-${project.id}`}
                    value={selectedUser[project.id] || ""}
                    onChange={(event) =>
                      setSelectedUser((prev) => ({
                        ...prev,
                        [project.id]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Select user</option>
                    {users.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.name || candidate.email} ({candidate.role})
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="submit">Assign</Button>
              </form>
              <div className="admin-card__list">
                {(projectUsers[project.id] || []).length ? (
                  projectUsers[project.id].map((assigned) => (
                    <div key={assigned.id} className="admin-card__item">
                      <div>
                        <strong>{assigned.name || assigned.email}</strong>
                        <span>
                          {assigned.email} - {assigned.role}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemove(project.id, assigned.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="panel__muted">No assigned users.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="panel__muted">No projects available.</p>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Admin;

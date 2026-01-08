import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { listProjects } from "../api/projects.js";
import { listTasks } from "../api/tasks.js";

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({ projects: 0, tasks: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      setLoading(true);
      setError("");

      try {
        const { projects } = await listProjects();
        const taskResults = await Promise.all(
          projects.map((project) =>
            listTasks(project.id).catch(() => ({ tasks: [] }))
          )
        );
        const tasksCount = taskResults.reduce(
          (sum, result) => sum + (result.tasks?.length || 0),
          0
        );

        if (isMounted) {
          setStats({ projects: projects.length, tasks: tasksCount });
          setRecentProjects(projects.slice(0, 3));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <section className="dashboard-grid">
        <div className="stat-card">
          <span>Projects</span>
          <strong>{loading ? "..." : stats.projects}</strong>
          <p>Active workspaces you can access.</p>
        </div>
        <div className="stat-card">
          <span>Tasks</span>
          <strong>{loading ? "..." : stats.tasks}</strong>
          <p>Tasks across your accessible projects.</p>
        </div>
        <div className="stat-card stat-card--accent">
          <span>Role</span>
          <strong>{user?.role}</strong>
          <p>Controls your access across the system.</p>
        </div>
      </section>

      <section className="panel">
        <header className="panel__header">
          <div>
            <h2>Recent projects</h2>
            <p>Quick view of your latest work.</p>
          </div>
        </header>
        {error ? <div className="panel__error">{error}</div> : null}
        <div className="panel__list">
          {loading ? (
            <p className="panel__muted">Loading projects...</p>
          ) : recentProjects.length ? (
            recentProjects.map((project) => (
              <div key={project.id} className="panel__item">
                <div>
                  <h3>{project.name}</h3>
                  <p>
                    Owner:{" "}
                    {project.owner_name || project.owner_email || project.owner_id}
                  </p>
                </div>
                <div className="panel__item-actions">
                  <span className="panel__tag">Project</span>
                  <Link
                    className="button button--ghost panel__link-button"
                    to={`/projects/${project.id}`}
                  >
                    Open
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="panel__muted">No projects yet. Create one.</p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;

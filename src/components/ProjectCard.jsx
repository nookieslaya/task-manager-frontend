import { Link } from "react-router-dom";
import Button from "./Button.jsx";

const ProjectCard = ({
  project,
  onDelete,
  canDelete = false,
  tasksPreview = [],
  className = "",
}) => {
  const preview = tasksPreview.slice(0, 3);

  const getChecklistSummary = (task) => {
    const items = Array.isArray(task.items) ? task.items : [];
    if (!items.length) {
      return "No checklist";
    }
    const done = items.filter((item) => item.is_done).length;
    return `Checklist ${done}/${items.length}`;
  };

  return (
    <article className={`project-card${className ? ` ${className}` : ""}`}>
      <div className="project-card__body">
        <span className="project-card__eyebrow">Project</span>
        <h3>{project.name}</h3>
        <p>
          Owner:{" "}
          {project.owner_name || project.owner_email || project.owner_id}
        </p>
        <div className="project-card__tasks">
          {preview.length ? (
            preview.map((task) => (
              <div key={task.id} className="project-card__task">
                <div className="project-card__task-header">
                  <span>{task.title}</span>
                  <span className={`status-${task.status}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
                <small>{getChecklistSummary(task)}</small>
              </div>
            ))
          ) : (
            <small className="project-card__muted">No tasks yet.</small>
          )}
        </div>
      </div>
      <div className="project-card__actions">
        <Link to={`/projects/${project.id}`} className="button button--ghost">
          View
        </Link>
        {onDelete && canDelete ? (
          <Button variant="danger" onClick={() => onDelete(project.id)}>
            Delete
          </Button>
        ) : null}
      </div>
    </article>
  );
};

export default ProjectCard;

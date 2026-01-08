import { NavLink } from "react-router-dom";

const Sidebar = ({ role, className = "" }) => {
  return (
    <aside className={`sidebar${className ? ` ${className}` : ""}`}>
      <div className="sidebar__brand">
        <span>TM</span>
        <div>
          <h2>Task Manager</h2>
          <p>Workspace</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Overview
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
          Projects
        </NavLink>
        {role === "ADMIN" ? (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
            Admin Panel
          </NavLink>
        ) : null}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__badge">v1.0</div>
        <p>Secure access - Roles</p>
      </div>
    </aside>
  );
};

export default Sidebar;

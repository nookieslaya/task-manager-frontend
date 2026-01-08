import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";

const Header = ({ user, onLogout, className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header
      className={`dashboard-header${className ? ` ${className}` : ""}`}
    >
      <div>
        <h1>Workspace</h1>
        <p>Track projects and tasks with clarity.</p>
      </div>
      <div className="dashboard-header__user">
        <div>
          <span>{user?.name || user?.email || "Loading..."}</span>
          <small>
            {user?.email}
            {user?.role ? ` | ${user.role}` : ""}
          </small>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
};

export default Header;

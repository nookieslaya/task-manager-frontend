import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

const DashboardLayout = ({ user, onLogout, children, className = "" }) => {
  return (
    <div className={`dashboard${className ? ` ${className}` : ""}`}>
      <Sidebar role={user?.role} />
      <div className="dashboard__body">
        <Header user={user} onLogout={onLogout} />
        <main className="dashboard__content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

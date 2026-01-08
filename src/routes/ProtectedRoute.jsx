import { Navigate } from "react-router-dom";
import { getToken } from "../api/api.js";

const ProtectedRoute = ({ user, loading, requiredRole, children }) => {
  const token = getToken();

  if (loading) {
    return <div className="page-loading">Loading your workspace...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;

import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../providers/AuthProvider";

const SuperAdminPrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (user && user.role === "superadmin") {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

SuperAdminPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SuperAdminPrivateRoute;

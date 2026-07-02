import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRedirectRoute = ({ children }) => {
  const { isLogin, user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return null;
  }

  if (isLogin && user) {
    let targetPath = "/userDashboard";
    if (user.role === "restaurant_owner") targetPath = "/owner-dashboard";
    else if (user.role === "delivery_partner") targetPath = "/partner-dashboard";
    else if (user.role === "admin") targetPath = "/admin-dashboard";

    return <Navigate to={targetPath} replace />;
  }

  return children;
};

export default AuthRedirectRoute;

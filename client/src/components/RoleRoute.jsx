import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLogin, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-text-primary">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-md flex items-center gap-3 animate-pulse">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="text-sm font-semibold text-text-secondary">Checking role access permissions...</span>
        </div>
      </div>
    );
  }

  if (!isLogin || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Determine target fallback redirect based on actual role
    let fallbackPath = "/userDashboard";
    if (user.role === "restaurant_owner") fallbackPath = "/owner-dashboard";
    else if (user.role === "delivery_partner") fallbackPath = "/partner-dashboard";
    else if (user.role === "admin") fallbackPath = "/admin-dashboard";

    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="max-w-md w-full bg-surface p-8 rounded-3xl border border-border shadow-lg space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-danger/10 text-danger mx-auto flex items-center justify-center">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Access Restriction Denied</h2>
          <p className="text-sm text-text-secondary">
            Your current role (<span className="font-semibold text-primary">{user.role || "guest"}</span>) does not have authorization to view this secure management console.
          </p>
          <div className="pt-2">
            <a
              href={fallbackPath}
              className="inline-block w-full py-3 px-5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-hover transition"
            >
              Return to Your Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleRoute;

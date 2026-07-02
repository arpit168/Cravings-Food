import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isLogin, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background text-text-primary">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-md flex items-center gap-3 animate-pulse">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="text-sm font-semibold text-text-secondary">Verifying authentication security...</span>
        </div>
      </div>
    );
  }

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

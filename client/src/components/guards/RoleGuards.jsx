import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RoleGuard({ user, allowedRoles }) {
  const hasRequiredRole = user && allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

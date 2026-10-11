import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ user, isLoading }) {
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen bg-stone-950 flex items-center justify-center text-amber-100 text-xs tracking-widest uppercase font-serif">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

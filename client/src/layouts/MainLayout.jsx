import React from "react";
import { Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/common/Navbar.jsx";

export default function MainLayout({ requireCustomer = false }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Show a loading screen while auth state is resolving
  if (loading) {
    return (
      <div className="h-screen bg-stone-950 flex items-center justify-center text-amber-100 text-xs tracking-widest uppercase font-serif">
        Loading session...
      </div>
    );
  }

  // If the route requires a logged-in customer and no user exists, redirect to register/login
  if (requireCustomer && !user) {
    return <Navigate to="/register" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Storefront Header */}
      <Navbar user={user} handleLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 py-8 text-center text-xs text-stone-600 font-mono">
        Solace Page Digital Bookstore &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

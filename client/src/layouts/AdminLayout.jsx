import React from "react";
import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
// 1. All imported icons are ready for use below
import { MdDashboard } from "react-icons/md";
import { GrCatalog } from "react-icons/gr";
import { IoIosAddCircle } from "react-icons/io";
import { FaUsers } from "react-icons/fa6";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a verification loading state while checking token/session
  if (loading) {
    return (
      <div className="h-screen bg-stone-950 flex items-center justify-center text-amber-100 text-xs tracking-widest uppercase font-serif">
        Verifying admin privileges...
      </div>
    );
  }

  // Strict route protection: redirect if unauthenticated or not an admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Updated array storing the React Icon components directly
  const adminNavLinks = [
    {
      name: "Dashboard & Metrics",
      path: "/admin",
      icon: MdDashboard,
      exact: true,
    },
    { name: "Manage Inventory", path: "/admin/inventory", icon: GrCatalog },
    { name: "Add New Novel", path: "/admin/novels/new", icon: IoIosAddCircle },
    { name: "Manage Users", path: "/admin/users", icon: FaUsers },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-serif text-amber-100 tracking-wider">
              Solace Page
            </span>
            <span className="bg-amber-400/10 border border-amber-400/30 text-amber-200 text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-0.5 rounded-full">
              Admin Console
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-xs text-stone-400 font-mono hidden sm:inline">
              Logged in as{" "}
              <strong className="text-amber-200">
                {user.email || user.name}
              </strong>
            </span>
            <NavLink
              to="/"
              className="text-xs uppercase tracking-widest text-amber-200/80 hover:text-amber-100 transition flex items-center gap-1.5 font-semibold"
            >
              <span>View Storefront</span> →
            </NavLink>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY (Sidebar Navigation + Content Area) */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 min-h-[calc(100vh-8rem)]">
        {/* SIDEBAR */}
        <aside className="lg:col-span-1 bg-stone-900/50 border-r border-stone-800/80 p-4 space-y-2 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
          <p className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold px-3 mb-3">
            Console Menu
          </p>
          {adminNavLinks.map((link) => {
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? "bg-amber-100/10 text-amber-200 border border-amber-400/30 shadow-sm"
                      : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
                  }`
                }
              >
                {/* 4. Render the React Icon with sizing */}
                <link.icon className="text-base shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </aside>

        {/* CONTENT VIEWPORT */}
        <main className="lg:col-span-4 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. FOOTER */}
      <footer className="border-t border-stone-900 py-6 text-center text-xs text-stone-600 font-mono bg-stone-950">
        Solace Page Administrative & Inventory Control &copy;{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}

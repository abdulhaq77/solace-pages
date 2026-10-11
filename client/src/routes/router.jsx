import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import Home from "../pages/public/Home.jsx";
import Shop from "../pages/public/Shop.jsx";
import NovelDetails from "../pages/public/NovelDetails.jsx";
import Cart from "../pages/public/Cart.jsx";
import Library from "../pages/public/Library.jsx";
import Login from "../pages/public/Login.jsx";
import Register from "../pages/public/Register.jsx";
import ErrorPage from "../pages/public/ErrorPage.jsx";
import NotFoundPage from "../pages/public/NotFoundPage.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import InventoryCatalog from "../pages/admin/InventoryCatalog.jsx";
import AddNovel from "../pages/admin/AddNovel.jsx";
import UsersPage from "../pages/admin/UsersPage.jsx";

export const router = createBrowserRouter([
  // Public / Guest Browsing Layer
  {
    path: "/",
    element: <MainLayout requireCustomer={false} />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "novel/:id", element: <NovelDetails /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // Customer Protected Layer
  {
    path: "/",
    element: <MainLayout requireCustomer={true} />,
    errorElement: <ErrorPage />,
    children: [
      { path: "cart", element: <Cart /> },
      { path: "library", element: <Library /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  // Admin Protected Layer
  {
    path: "/admin",
    element: <AdminLayout />, // Handles its own authentication & admin role guard internally!
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminDashboard /> }, // Metrics & Quick Overview
      { path: "inventory", element: <InventoryCatalog /> }, // InventoryCatalog screen
      { path: "novels/new", element: <AddNovel /> }, // AddNovel screen
      { path: "users", element: <UsersPage /> }, // UsersPage screen
    ],
  },
]);

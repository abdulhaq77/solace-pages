import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api.js";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount via HttpOnly cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const loginUser = async (email, password) => {
    console.log("Attempting login with email:", email);
    const res = await API.post("/auth/login", { email, password });
    console.log("Login response:", res.data);
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const registerUser = async (name, email, password) => {
    const res = await API.post("/auth/register", { name, email, password });
    setUser(res.data.data.user);
    return res.data.data.user;
  };

  const logout = async () => {
    console.log("testing logout...");
    await API.post("/auth/logout");
    toast.success("You have been logged out.");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginUser, registerUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginUser = (userData) => {
    // userData: { name, email, role, token }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token || "");
    localStorage.setItem("role", userData.role || "");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // Removed window.location.href to make logout SPA-friendly
    // Navigation will now be handled in the component
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

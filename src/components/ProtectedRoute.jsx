// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

/**
 * ProtectedRoute restricts access to routes based on authentication and role.
 * Uses both UserContext and localStorage for reliable auth checking.
 *
 * @param {React.ReactNode} children - The components to render if access is allowed
 * @param {Array<string>} allowedRoles - Optional array of roles allowed to access this route
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const role = user?.role || localStorage.getItem("role");

  // Not logged in → redirect to login
  if (!token) {
    console.warn("Access denied: user not logged in");
    return <Navigate to="/login" replace />;
  }

  // Role check if allowedRoles is provided
  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    console.warn(`Access denied: user role "${role}" is not allowed`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted
  return <>{children}</>;
}

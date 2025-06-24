import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Route Component (redirect if already authenticated)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (isAuthenticated && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/main"} />;
  }

  return children;
};

export default AuthRoute;

import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, isAuthLoading, user }) {
  if (isAuthLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "16px",
        color: "#666",
      }}>
        <p>Loading your adventure...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the protected component
  return children;
}

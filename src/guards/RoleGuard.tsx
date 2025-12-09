import React from "react";
import { Navigate } from "react-router-dom";
import { useGetIdentity } from "@refinedev/core";

export const AdminRoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetIdentity<{ role?: string }>();
  if (isLoading) return <div>Checking access...</div>;
  // pastikan role yang dicek sama persis dengan yang dikembalikan authProvider
  if (user?.role !== "admin") {
    return <Navigate to="/user-dashboard" replace />;
  }
  return <>{children}</>;
};

export const UserRoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetIdentity<{ role?: string }>();
  if (isLoading) return <div>Checking access...</div>;
  if (user?.role !== "user") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  return <>{children}</>;
};

import { usePermissions } from "@refinedev/core";
import { Navigate, Outlet } from "react-router-dom";
const RoleProtected = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { data: currentRole, isLoading } = usePermissions({});
  const storedAuth = localStorage.getItem("auth");
  const storedUser = storedAuth ? JSON.parse(storedAuth) : null;
  const role = currentRole || storedUser?.role;
  if (isLoading && !role) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        color: "#002347",
        fontWeight: "bold",
        fontFamily: "sans-serif"
      }}>
        Memverifikasi Akses...
      </div>
    );
  }
  if (role && allowedRoles.includes(role)) {
    return <Outlet />;
  }
  if (role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (role === "user") {
    return <Navigate to="/user-dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};
export default RoleProtected;
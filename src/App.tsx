import { Refine, Authenticated, usePermissions } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import dataProvider from "@refinedev/simple-rest";
import { authProvider } from "./authProvider";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import NotFound from "./pages/NotFound";
import DataPegawai from "./pages/admin/dataPegawai";
import UserDashboard from "./pages/users/UserDashboard";
import { ProfileUserSettings } from "./pages/users/UserSettings";
import { AdminProfileSettings } from "./pages/admin/AdminSettings";

const RoleProtected = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { data: roleFromHook, isLoading } = usePermissions({});

  // Baca langsung dari localStorage untuk hindari delay React Query
  const storedAuth = localStorage.getItem("auth");
  const storedUser = storedAuth ? JSON.parse(storedAuth) : null;
  const storedRole = storedUser?.role;

  const currentRole = roleFromHook || storedRole;

  if (isLoading && !currentRole) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading Access...
      </div>
    );
  }

  if (currentRole && allowedRoles.includes(currentRole)) {
    return <Outlet />;
  }

  if (currentRole === "admin") return <Navigate to="/admin-dashboard" replace />;
  if (currentRole === "user") return <Navigate to="/user-dashboard" replace />;

  return <Navigate to="/login" replace />;
};

// --- ROOT REDIRECT ---
const RootRedirect = () => {
  const { data: role, isLoading } = usePermissions({});
  if (isLoading) return null;

  if (role === "admin") return <Navigate to="/admin-dashboard" />;
  if (role === "user") return <Navigate to="/user-dashboard" />;

  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Refine dataProvider={dataProvider("http://localhost:3000")} authProvider={authProvider}>
        <Routes>
          {/* 1. LOGIN PAGE (TIDAK PERLU PROTEKSI) */}
          <Route path="/login" element={<Login />} />
          
          {/* 2. PROTECTED ROUTE: ADMIN */}
          <Route
            element={
              <Authenticated key="admin-auth" fallback={<Navigate to="/login" />}>
                <RoleProtected allowedRoles={["admin"]} />
              </Authenticated>
            }
          >
            <Route
              path="/admin-dashboard"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin-pegawai"
              element={
                <AdminLayout>
                  <DataPegawai />
                </AdminLayout>
              }
            />
            <Route
              path="/admin-settings"
              element={
                <AdminLayout>
                  <AdminProfileSettings />
                </AdminLayout>
              }
            />
          </Route>

          {/* 3. PROTECTED ROUTE: USER */}
          <Route
            element={
              <Authenticated key="user-auth" fallback={<Navigate to="/login" />}>
                <RoleProtected allowedRoles={["user"]} />
              </Authenticated>
            }
          >
            <Route
              path="/user-dashboard"
              element={
                <UserLayout>
                  <UserDashboard />
                </UserLayout>
              }
            />
            <Route
              path="/user-settings"
              element={
                <UserLayout>
                  <ProfileUserSettings />
                </UserLayout>
              }
            />
          </Route>

          {/* 4. ROOT PATH (/) */}
          <Route
            path="/"
            element={
              <Authenticated key="root-auth" fallback={<Navigate to="/login" />}>
                <RootRedirect />
              </Authenticated>
            }
          />
          {/* 5. NOT FOUND PAGE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;

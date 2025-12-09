import { Refine, Authenticated, usePermissions } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import dataProvider from "@refinedev/simple-rest";
import { authProvider } from "./authProvider";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import NotFound from "./pages/NotFound";


// --- ROLE ---
const RoleProtected = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { data: role, isLoading } = usePermissions({});

  if (isLoading) return <div>Loading permissions...</div>;

  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  if (role === "admin") return <Navigate to="/admin-dashboard" />;
  if (role === "user") return <Navigate to="/user-dashboard" />;

  // 3. Fallback
  return <Navigate to="/login" />;
};
// --- ROOT REDIRECT ---
const RootRedirect = () => {
    const { data: role, isLoading } = usePermissions({});
    if (isLoading) return null;

    if (role === "admin") return <Navigate to="/admin-dashboard" />;
    if (role === "user") return <Navigate to="/user-dashboard" />;
    
    return <Navigate to="/login" />;
}


function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider("http://localhost:3000")}
        authProvider={authProvider}
      >
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
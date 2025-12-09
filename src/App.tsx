import { Refine, Authenticated } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import dataProvider from "@refinedev/simple-rest";

import { authProvider } from "./authProvider";

import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Refine
        // dataProvider={dataProvider("http://localhost:3000")}
        authProvider={authProvider}
      >
        <Routes>
          {/* Route /dashboard dihapus atau diganti dengan Admin/User Dashboard */}
          {/* Contoh: gunakan /admin-dashboard atau /user-dashboard sesuai role */}

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard (Hanya Admin) */}
          <Route
            path="/admin-dashboard"
            element={
              <Authenticated fallback={<Navigate to="/login" />}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </Authenticated>
            }
          />

          {/* User Dashboard (Hanya User) */}
          <Route
            path="/user-dashboard"
            element={
              <Authenticated fallback={<Navigate to="/login" />}>
                <UserDashboard />
              </Authenticated>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;

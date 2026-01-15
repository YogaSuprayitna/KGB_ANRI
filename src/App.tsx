import { Authenticated, Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
} from "@refinedev/react-router";
import { App as AntdApp } from "antd";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider"; 
import AdminLayout from "./components/layout/adminLayout";
import UserLayout from "./components/layout/userLayout";
import RoleProtected from "./components/roleProtected"; 

// Import Pages
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/dashboard";
import DataPegawai from "./pages/admin/dataPegawai";
import MenuUsulanKGB from "./pages/admin/usulanKGB";
import UsulanKGBVerify from "./pages/admin/usulanKGBVerify"; // Halaman Verifikasi Baru
import KGBAdminMenuRiwayat from "./pages/admin/riwayatKGB";
import UserDashboard from "./pages/users/dashboard";
import { ProfileUserSettings } from "./pages/users/settings";
import NotificationList from "./pages/notificationList";
import NotificationDetail from "./pages/notificationDetail";

import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const CatchAllRedirect = () => {
  const storedAuth = localStorage.getItem("auth");
  const user = storedAuth ? JSON.parse(storedAuth) : null;

  if (user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (user?.role === "user") {
    return <Navigate to="/user-dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

const LayoutSelector = () => {
  const storedAuth = localStorage.getItem("auth");
  const user = storedAuth ? JSON.parse(storedAuth) : null;

  if (user?.role === "admin") {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AntdApp>
        <Refine
          dataProvider={dataProvider("http://localhost:3001")} 
          notificationProvider={useNotificationProvider}
          routerProvider={routerProvider}
          authProvider={authProvider}
          options={{
            syncWithLocation: true, 
            warnWhenUnsavedChanges: true,
          }}
          resources={[
            {
              name: "admin-dashboard",
              list: "/admin-dashboard",
              meta: { label: "Dashboard", icon: <DashboardOutlined /> },
            },
            {
              name: "admin-pegawai",
              list: "/admin-pegawai",
              meta: { label: "Data Pegawai", icon: <TeamOutlined /> },
            },
            {
              name: "admin-menu-usulan",
              list: "/admin-menu-usulan",
              // Menambahkan meta edit untuk mendukung navigasi halaman verifikasi
              edit: "/admin-menu-usulan/verifikasi/:id",
              meta: { label: "Usulan KGB", icon: <FileTextOutlined /> },
            },
            {
              name: "admin-menu-riwayat",
              list: "/admin-menu-riwayat",
              meta: { label: "Riwayat KGB", icon: <HistoryOutlined /> },
            },
            {
              name: "user-dashboard",
              list: "/user-dashboard",
              meta: { label: "Dashboard", icon: <DashboardOutlined /> },
            },
            {
              name: "user-settings",
              list: "/user-settings",
              meta: { label: "Pengaturan", icon: <SettingOutlined /> },
            }
          ]}
        >
          <Routes>
            {/* ADMIN SCOPE */}
            <Route
              element={
                <Authenticated key="admin-scope" fallback={<CatchAllNavigate to="/login" />}>
                  <RoleProtected allowedRoles={["admin"]} />
                </Authenticated>
              }
            >
              <Route element={<LayoutSelector />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin-pegawai" element={<DataPegawai />} />
                
                {/* Rute Usulan KGB & Verifikasi */}
                <Route path="/admin-menu-usulan">
                    <Route index element={<MenuUsulanKGB />} />
                    <Route path="verifikasi/:id" element={<UsulanKGBVerify />} />
                </Route>

                <Route path="/admin-menu-riwayat" element={<KGBAdminMenuRiwayat />} />
                
                <Route path="/notifications">
                  <Route index element={<NotificationList />} />
                  <Route path="show/:notificationId" element={<NotificationDetail />} />
                </Route>
              </Route>
            </Route>

            {/* USER SCOPE */}
            <Route
              element={
                <Authenticated key="user-scope" fallback={<CatchAllNavigate to="/login" />}>
                  <RoleProtected allowedRoles={["user"]} />
                </Authenticated>
              }
            >
              <Route element={<LayoutSelector />}>
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/user-settings" element={<ProfileUserSettings />} />
              </Route>
            </Route>

            {/* LOGIN PAGE */}
            <Route
              element={
                <Authenticated key="auth-pages" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
            </Route>

            {/* ROOT REDIRECT */}
            <Route
              path="/"
              element={
                <Authenticated key="root-redirect" fallback={<Navigate to="/login" />}>
                  <NavigateToResource />
                </Authenticated>
              }
            />

            <Route path="*" element={<CatchAllRedirect />} />
          </Routes>
          <DocumentTitleHandler handler={({ resource, action }) => {
              const label = resource?.meta?.label || "";
              const suffix = "KGB ANRI";
              if (action === "edit") return `Verifikasi Usulan | ${suffix}`;
              return `${label} | ${suffix}`;
          }} />
        </Refine>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
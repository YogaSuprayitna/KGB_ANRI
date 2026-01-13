import { Authenticated, Refine } from "@refinedev/core";
import { ErrorComponent, useNotificationProvider } from "@refinedev/antd";
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
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import RoleProtected from "./components/RoleProtected"; 


import Login from "./pages/login";
import AdminDashboard from "./pages/admin/dashboard";
import DataPegawai from "./pages/admin/dataPegawai";
import MenuUsulanKGB from "./pages/admin/usulanKGB";
import KGBAdminMenuRiwayat from "./pages/admin/riwayatKGB";
import { AdminProfileSettings } from "./pages/admin/settings";
import UserDashboard from "./pages/users/Dashboard";
import { ProfileUserSettings } from "./pages/users/Settings";
import NotificationList from "./pages/Notificationlist";
import NotificationDetail from "./pages/Notificationdetail";


import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";


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
              meta: { label: "Usulan KGB", icon: <FileTextOutlined /> },
            },
            {
              name: "admin-menu-riwayat",
              list: "/admin-menu-riwayat",
              meta: { label: "Riwayat KGB", icon: <HistoryOutlined /> },
            },
            {
              name: "admin-settings",
              list: "/admin-settings",
              meta: { label: "Pengaturan", icon: <SettingOutlined /> },
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
                <Route path="/admin-menu-usulan" element={<MenuUsulanKGB />} />
                <Route path="/admin-menu-riwayat" element={<KGBAdminMenuRiwayat />} />
                <Route path="/admin-settings" element={<AdminProfileSettings />} />
                <Route path="/notifications">
                  <Route index element={<NotificationList />} />
                  <Route path="show/:notificationId" element={<NotificationDetail />} />
                </Route>
              </Route>
            </Route>

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

            <Route
              element={
                <Authenticated key="auth-pages" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
            </Route>

            <Route
              path="/"
              element={
                <Authenticated key="root-redirect" fallback={<Navigate to="/login" />}>
                  <NavigateToResource />
                </Authenticated>
              }
            />

            <Route path="*" element={<ErrorComponent />} />
          </Routes>
          <DocumentTitleHandler handler={({ resource }) => `KGB ANRI | ${resource?.meta?.label || ""}`} />
        </Refine>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
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
import dataProvider from "@refinedev/simple-rest";

// Providers & Layouts
import { authProvider } from "./authProvider";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";

// Pages
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DataPegawai from "./pages/admin/dataPegawai";
import MenuUsulanKGB from "./pages/admin/AdminMenuUsulan";
import KGBAdminMenuRiwayat from "./pages/admin/AdminMenuRiwayat";
import { AdminProfileSettings } from "./pages/admin/AdminSettings";
import UserDashboard from "./pages/users/UserDashboard";
import { ProfileUserSettings } from "./pages/users/UserSettings";
import NotificationList from "./pages/Notificationlist";
import NotificationDetail from "./pages/Notificationdetail";
import NotFound from "./pages/NotFound";

// Icons
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";

// --- CUSTOM LAYOUT SELECTOR ---
// Memilih layout berdasarkan role user secara otomatis
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
          dataProvider={dataProvider("http://localhost:3000")}
          notificationProvider={useNotificationProvider}
          routerProvider={routerProvider}
          authProvider={authProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
          // Definisi Resources untuk Menu Sidebar otomatis
          resources={[
            {
              name: "admin-dashboard",
              list: "/admin-dashboard",
              meta: { label: "Dashboard", icon: <DashboardOutlined />, canDelete: false },
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
              meta: { hide: true }, // Disembunyikan jika role adalah admin
            }
          ]}
        >
          <Routes>
            {/* --- PROTECTED ROUTES (LOGGED IN) --- */}
            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <LayoutSelector />
                </Authenticated>
              }
            >
              {/* Redirect root ke Dashboard sesuai role */}
              <Route index element={<NavigateToResource resource="admin-dashboard" />} />

              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-pegawai" element={<DataPegawai />} />
              <Route path="/admin-menu-usulan" element={<MenuUsulanKGB />} />
              <Route path="/admin-menu-riwayat" element={<KGBAdminMenuRiwayat />} />
              <Route path="/admin-settings" element={<AdminProfileSettings />} />
              
              {/* Notifications */}
              <Route path="/notifications">
                <Route index element={<NotificationList />} />
                <Route path="show/:notificationId" element={<NotificationDetail />} />
              </Route>

              {/* User Routes */}
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/user-settings" element={<ProfileUserSettings />} />
            </Route>

            {/* --- PUBLIC ROUTES --- */}
            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
            </Route>

            {/* --- ERROR PAGE --- */}
            <Route
              element={
                <Authenticated key="error-pages" fallback={<Outlet />}>
                  <LayoutSelector />
                </Authenticated>
              }
            >
              <Route path="*" element={<ErrorComponent />} />
            </Route>
          </Routes>

          <DocumentTitleHandler
            handler={({ resource, action }) => {
              const suffix = "KGB ANRI";
              const resourceLabel = resource?.meta?.label ?? resource?.name ?? "";
              const prefix = resourceLabel ? `${resourceLabel} | ` : "";
              return `${prefix}${suffix}`;
            }}
          />
        </Refine>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
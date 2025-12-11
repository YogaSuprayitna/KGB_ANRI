import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, message, Grid } from "antd";
import { LayoutDashboard, Menu as MenuIcon, LogOut, User, Settings, ChevronRight, Bell, X } from "lucide-react";
import { useGetIdentity, useLogout } from "@refinedev/core";
import "../../styles/Layout.css";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const location = useLocation();
  const navigate = useNavigate();

  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity();


  const handleLogout = () => {
    logout(
      {},
      {
        onSuccess: () => {
          setTimeout(() => {
            message.success({
              content: "Logout berhasil!",
              duration: 2,
            });
          }, 400);
        },
        onError: () => {
          message.error("Gagal logout");
        },
      }
    );
  };

  const menuItems = [
    {
      key: "dashboard",
      path: "/user-dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      key: "pegawai",
      path: "/user-pegawai",
      icon: <User size={20} />,
      label: "Data Pegawai",
    },
    {
      key: "settings",
      path: "/user-settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  const activeItem = menuItems.find((item) => location.pathname.startsWith(item.path));
  const selectedKey = activeItem ? activeItem.key : "dashboard";

  const onMenuClick = (item: any) => {
    const menu = menuItems.find((m) => m.key === item.key);
    if (menu) navigate(menu.path);
  };

  const profileMenuItems = [
    {
      key: "Dashboard",
      label: (
        <Space>
          <User size={16} />
          <span>Dashboard</span>
        </Space>
      ),
    },
    {
      key: "settings",
      label: (
        <Space>
          <Settings size={16} />
          <span>Pengaturan</span>
        </Space>
      ),
    },
    { type: "divider" as const },
    {
      key: "logout",
      danger: true,
      label: (
        <Space>
          <LogOut size={16} />
          <span>Logout</span>
        </Space>
      ),
    },
  ];

  const onProfileMenuClick = ({ key }: { key: string }) => {
    if (key === "Dashboard") {
      navigate("/");
    } else if (key === "settings") {
      navigate("/user-settings");
    } else if (key === "logout") {
      handleLogout();
    }
  };

  return (
    <Layout className="layout">
      {/* SIDEBAR */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        breakpoint="lg" 
        collapsedWidth={isMobile ? 0 : 80} 
        onBreakpoint={(broken) => setCollapsed(broken)} 
        width={260} 
        className="custom-sider"
      >
        <div
          className="logo-container"
          style={{
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? 0 : "0 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="logo-box">
              <img src="/assets/ANRI.png" alt="Logo ANRI" className="logo-image" />
            </div>

            {!collapsed && <span className="logo-text">KGB ANRI</span>}
          </div>

          {/* Tombol Close (Mobile) */}
          {isMobile && !collapsed && <Button type="text" icon={<X size={20} />} onClick={() => setCollapsed(true)} className="close-btn" />}
        </div>

        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[selectedKey]}
          items={menuItems} 
          onClick={onMenuClick} 
          className="custom-menu" 
        />
      </Sider>

      {/* MOBILE OVERLAY */}
      {isMobile && !collapsed && <div onClick={() => setCollapsed(true)} className="mobile-overlay" />}

      {/* CONTENT */}
      <Layout
        className="site-layout"
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 260,
        }}
      >
        <Header className="site-header">
          <div style={{ display: "flex", gap: 16 }}>
            <Button type="text" icon={collapsed ? <ChevronRight size={20} /> : <MenuIcon size={20} />} onClick={() => setCollapsed(!collapsed)} className="icon-btn" />
          </div>

          <Space size={16} align="center">
            <Button type="text" icon={<Bell size={20} />} className="icon-btn" />
            <div className="divider" />

            {/* Dropdown Profile Diperbaiki (menambah onClick) */}
            <Dropdown
              menu={{
                items: profileMenuItems,
                onClick: onProfileMenuClick,
              }}
              placement="bottomRight"
              arrow
            >
              <div className="profile-box">
                <Avatar className="user-avatar" size={40} icon={<User size={20} />} />
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: 1.3,
                    }}
                  >
                    <Text strong style={{ fontSize: 14, color: "#333" }}>
                      {user?.name || "User"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, color: "#999" }}>
                      User
                    </Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content className="content-wrapper">
          <div className="content-box">{children}</div>

          <div className="footer-text">
            <span>KGB ANRI User Panel © 2025</span>
            <span style={{ margin: "0 8px" }}>•</span>
            <span>All rights reserved</span>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
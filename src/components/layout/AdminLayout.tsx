import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, message, Grid } from "antd";
import { 
  Menu as MenuIcon, LogOut, User, 
  ChevronRight, Bell, X, Settings 
} from "lucide-react";
import { useGetIdentity, useLogout, useMenu } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import "../../styles/Layout.css"; // Impor file CSS eksternal

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity();
  
  // Mengambil data menu otomatis dari resources di App.tsx
  const { menuItems, selectedKey } = useMenu();

  const handleLogout = () => {
    logout({}, {
      onSuccess: () => {
        setTimeout(() => {
          message.success({ content: "Logout berhasil!", duration: 2 });
        }, 400);
      },
      onError: () => message.error("Gagal logout"),
    });
  };

  const profileMenuItems = [
    { key: "settings", label: <Space><Settings size={16} /><span>Pengaturan</span></Space> },
    { type: "divider" as const },
    { key: "logout", danger: true, label: <Space><LogOut size={16} /><span>Logout</span></Space> },
  ];

  return (
    <Layout className="layout">
      {/* SIDEBAR */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        breakpoint="lg" 
        collapsedWidth={isMobile ? 0 : 80} 
        width={260} 
        className="custom-sider"
      >
        <div className="logo-container" style={{ justifyContent: collapsed ? "center" : "space-between", padding: collapsed ? "0" : "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="logo-box">
              <img src="/assets/ANRI.png" alt="Logo ANRI" className="logo-image" />
            </div>
            {!collapsed && <span className="logo-text">KGB ANRI</span>}
          </div>
          {isMobile && !collapsed && (
            <Button 
              type="text" 
              icon={<X size={20} color="#fff" />} 
              onClick={() => setCollapsed(true)} 
              className="icon-btn"
            />
          )}
        </div>

        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[selectedKey]} 
          className="custom-menu"
          onClick={({ key }) => {
            const item = menuItems.find((m) => m.key === key);
            if (item) navigate(item.route || "");
          }}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
        />
      </Sider>

      {/* MOBILE OVERLAY */}
      {isMobile && !collapsed && (
        <div 
          onClick={() => setCollapsed(true)} 
          className="mobile-overlay" 
        />
      )}

      {/* MAIN CONTENT AREA */}
      <Layout 
        className="site-layout" 
        style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 260 }}
      >
        <Header className="site-header">
          <div className="header-left">
            <Button 
              type="text" 
              icon={collapsed ? <ChevronRight size={20} /> : <MenuIcon size={20} />} 
              onClick={() => setCollapsed(!collapsed)} 
              className="icon-btn" 
            />
          </div>

          <div className="header-right">
            <Button 
              type="text" 
              icon={<Bell size={20} />} 
              className="icon-btn" 
              onClick={() => navigate("/notifications")} 
            />
            
            <div className="divider" />

            <Dropdown 
              menu={{ 
                items: profileMenuItems, 
                onClick: ({ key }) => key === "logout" ? handleLogout() : navigate("/admin-settings") 
              }} 
              placement="bottomRight" 
              arrow
            >
              <div className="profile-box">
                <Avatar 
                  className="user-avatar" 
                  size={40} 
                  icon={<User size={20} />} 
                />
                {!isMobile && (
                  <div className="profile-info">
                    <Text strong style={{ fontSize: 14, color: "#1e293b", display: 'block' }}>
                      {user?.name || "Admin"}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#64748b", display: 'block' }}>
                      Administrator
                    </Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="content-wrapper">
          <div className="content-box">
            {children}
          </div>

          <div className="footer-text">
            <span>KGB ANRI Admin Panel © 2026</span>
            <span style={{ margin: "0 8px" }}>•</span>
            <span>Arsip Nasional Republik Indonesia</span>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
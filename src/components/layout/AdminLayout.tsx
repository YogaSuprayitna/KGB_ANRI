import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, message, Grid } from "antd";
import { Menu as MenuIcon, LogOut, User, ChevronRight, Bell, X, Settings } from "lucide-react";
import { useGetIdentity, useLogout, useMenu } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import "../../styles/layout.css";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = !useBreakpoint().lg;
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { data: userIdent } = useGetIdentity();
  
  const { menuItems, selectedKey } = useMenu();

  // FILTER MENU KHUSUS ADMIN
  const filteredMenuItems = menuItems.filter((item) => item.name.startsWith("admin-"));

  return (
    <Layout className="layout">
      <Sider 
        trigger={null} collapsible collapsed={collapsed} 
        breakpoint="lg" collapsedWidth={isMobile ? 0 : 80} width={260}
        className="custom-sider"
      >
        <div className="logo-container">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "20px" }}>
            <div className="logo-box">
              <img src="/ANRI.png" alt="Logo" className="logo-image"/>
            </div>
            {!collapsed && <span className="logo-text">KGB ANRI</span>}
          </div>
        </div>

        <Menu 
          theme="dark" mode="inline" selectedKeys={[selectedKey]} className="custom-menu"
          onClick={({ key }) => {
            const item = filteredMenuItems.find((m) => m.key === key);
            if (item) navigate(item.route || "");
          }}
          items={filteredMenuItems.map((item) => ({
            key: item.key, icon: item.icon, label: item.label,
          }))}
        />
      </Sider>

      <Layout className="site-layout" style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 260 }}>
        <Header className="site-header">
          <div className="header-left">
            <Button type="text" icon={collapsed ? <ChevronRight size={20} /> : <MenuIcon size={20} />} onClick={() => setCollapsed(!collapsed)} className="icon-btn" />
          </div>
          <div className="header-right">
            <Button type="text" icon={<Bell size={20} />} className="icon-btn" onClick={() => navigate("/notifications")} />
            <div className="divider" />
            <Dropdown menu={{ items: [{ key: "logout", danger: true, label: "Logout" }], onClick: () => logout() }} placement="bottomRight">
              <div className="profile-box">
                <Avatar className="user-avatar" size={40} icon={<User size={20} />} />
                {!isMobile && (
                  <div className="profile-info">
                    <Text strong style={{ display: 'block' }}>{userIdent?.name || "Admin"}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>Administrator</Text>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="content-wrapper"><div className="content-box">{children}</div></Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
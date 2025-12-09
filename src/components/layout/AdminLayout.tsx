import React, { useState, ReactNode } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, theme, Space, Typography, message } from 'antd';
import { 
  LayoutDashboard, 
  Menu as MenuIcon, 
  LogOut, 
  User, 
  Settings, 
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { useGetIdentity, useLogout } from "@refinedev/core";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity();
  
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorder },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
  ];

  const handleLogout = () => {
    logout(
      {},
      {
        onSuccess: () => {
          message.success('Logout berhasil');
          // Redirect akan otomatis dilakukan oleh Refine
        },
        onError: (error) => {
          message.error('Gagal logout. Silakan coba lagi.');
          console.error('Logout error:', error);
        },
      }
    );
  };

  const profileMenuItems = [
    {
      key: 'profile',
      label: (
        <Space>
          <User size={16} />
          <span>Profil Saya</span>
        </Space>
      ),
    },
    {
      key: 'settings',
      label: (
        <Space>
          <Settings size={16} />
          <span>Pengaturan</span>
        </Space>
      ),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      danger: true,
      label: (
        <Space>
          <LogOut size={16} />
          <span>Logout</span>
        </Space>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* --- SIDEBAR --- */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
            if (broken) setCollapsed(true);
        }}
        width={250}
        style={{
          background: '#001529',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        {/* Logo Area */}
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 24px',
          transition: 'all 0.2s',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
           {/* Ganti dengan Logo Image anda nanti */}
           <div style={{ 
             width: 32, 
             height: 32, 
             background: '#1890ff', 
             borderRadius: 6, 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             color: 'white',
             fontWeight: 'bold'
           }}>
             A
           </div>
           {!collapsed && (
             <span style={{ 
               color: 'white', 
               fontSize: 18, 
               fontWeight: 600, 
               marginLeft: 12,
               whiteSpace: 'nowrap',
               overflow: 'hidden'
             }}>
               Admin Panel
             </span>
           )}
        </div>

        {/* Menu Utama */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          style={{ marginTop: 10, border: 'none' }}
        />
      </Sider>

      {/* --- LAYOUT KANAN (Header + Content) --- */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        
        {/* --- NAVBAR / HEADER --- */}
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 99,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {/* Tombol Hamburger / Collapse */}
          <Button
            type="text"
            icon={collapsed ? <ChevronRight /> : <MenuIcon />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 45,
              height: 45,
            }}
          />

          {/* Area Kanan: Profil */}
          <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: borderRadiusLG,
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Avatar 
                style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} 
                size="large"
                icon={<User size={20} />}
              />
              <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <Text strong>{user?.name || 'Admin User'}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>Administrator</Text>
              </div>
            </div>
          </Dropdown>
        </Header>

        {/* --- MAIN CONTENT --- */}
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              border: `1px solid ${colorBorder}`,
            }}
          >
            {/* INI ADALAH PROPS.CHILDREN */}
            {children}
          </div>
          
          {/* Footer Simple */}
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#888' }}>
            Ant Design Admin ©2025 Created by You
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
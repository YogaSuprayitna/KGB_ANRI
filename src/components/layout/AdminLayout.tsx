import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Input, Space, Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  ProfileOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '2', icon: <UserOutlined />, label: 'Users' },
  { key: '3', icon: <ShoppingOutlined />, label: 'Products' },
  { key: '4', icon: <FileTextOutlined />, label: 'Orders' },
  { key: '5', icon: <BarChartOutlined />, label: 'Analytics' },
  { key: '6', icon: <TeamOutlined />, label: 'Customers' },
  { key: '7', icon: <SettingOutlined />, label: 'Settings' },
];

const profileMenu = (
  <Menu
    onClick={({ key }) => {
      if (key === 'logout') {
        alert('Logout clicked!');
      }
    }}
    items={[
      { key: 'profile', icon: <ProfileOutlined />, label: 'My Profile' },
      { key: 'messages', icon: <MailOutlined />, label: 'Messages' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Account Settings' },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ]}
  />
);

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string>('1');

  const getPageContent = (): { title: string; content: React.ReactNode } => {
    const pages: Record<string, { title: string; content: React.ReactNode }> = {
      '1': {
        title: 'Dashboard Overview',
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Users</p>
                  <h3 className="text-3xl font-bold mt-2">2,543</h3>
                  <p className="text-blue-100 text-xs mt-2">↑ 12% from last month</p>
                </div>
                <UserOutlined className="text-5xl opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Revenue</p>
                  <h3 className="text-3xl font-bold mt-2">$45.2K</h3>
                  <p className="text-green-100 text-xs mt-2">↑ 8% from last month</p>
                </div>
                <BarChartOutlined className="text-5xl opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Orders</p>
                  <h3 className="text-3xl font-bold mt-2">1,234</h3>
                  <p className="text-purple-100 text-xs mt-2">↑ 23% from last month</p>
                </div>
                <ShoppingOutlined className="text-5xl opacity-30" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Products</p>
                  <h3 className="text-3xl font-bold mt-2">856</h3>
                  <p className="text-orange-100 text-xs mt-2">↑ 5% from last month</p>
                </div>
                <FileTextOutlined className="text-5xl opacity-30" />
              </div>
            </div>
          </div>
        ),
      },
      '2': { title: 'Users Management', content: 'User management content here...' },
      '3': { title: 'Products', content: 'Products management content here...' },
      '4': { title: 'Orders', content: 'Orders list and management here...' },
      '5': { title: 'Analytics', content: 'Analytics and reports here...' },
      '6': { title: 'Customers', content: 'Customer management here...' },
      '7': { title: 'Settings', content: 'System settings here...' },
    };
    return pages[selectedKey] || pages['1'];
  };

  const currentPage = getPageContent();

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="shadow-lg"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
        <div className="flex items-center justify-center h-16 mb-4">
          <div className="text-white font-bold text-xl">
            {collapsed ? 'AD' : 'ADMIN'}
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ background: 'transparent', border: 'none' }}
        />
      </Sider>
      <Layout>
        <Header
          className="flex items-center justify-between px-6 shadow-md"
          style={{
            background: '#fff',
            padding: '0 24px',
          }}
        >
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              className="w-64"
              style={{ borderRadius: '8px' }}
            />
          </div>
          <Space size="large">
            <Badge count={5} offset={[-5, 5]}>
              <Button
                type="text"
                icon={<BellOutlined className="text-lg" />}
                className="flex items-center justify-center"
              />
            </Badge>
            <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-all">
                <Avatar
                  size="default"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-gray-800">Admin User</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>
        <Content
          className="m-6 p-6 bg-gray-50 rounded-xl"
          style={{
            minHeight: 280,
          }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{currentPage.title}</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          {currentPage.content}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar icon={<ShoppingOutlined />} className="bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New order received</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar icon={<FileTextOutlined />} className="bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Product updated</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
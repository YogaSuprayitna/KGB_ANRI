import React, { useState } from "react";
import { 
  Row, Col, Card, Typography, Avatar, Tabs, Tag, List, 
  Button, Space, Switch, Form, Input, message, Divider, 
  Tooltip, Badge, Timeline 
} from "antd";
import {
  UserOutlined, MailOutlined, PhoneOutlined,
  SafetyCertificateOutlined, EditOutlined,
  HistoryOutlined, GlobalOutlined, KeyOutlined, LaptopOutlined,
  LogoutOutlined, BellOutlined
} from "@ant-design/icons";


import { DynamicModal } from "../../components/DynamicModal"; 

const { Title, Text } = Typography;



interface IAdminProfile {
  name: string;
  username: string;
  email: string;
  role: "Super Admin" | "Administrator" | "Operator";
  unit: string;
  phone: string;
  lastLogin: string;
  status: "Active" | "Inactive";
}


const initialAdminData: IAdminProfile = {
  name: "Administrator Utama",
  username: "admin_pusat",
  email: "admin.pusat@anri.go.id",
  role: "Super Admin",
  unit: "Biro Perencanaan & Kepegawaian",
  phone: "0811-9988-7766",
  lastLogin: "11 Des 2025, 08:30 WIB",
  status: "Active",
};


const mockActivityLog = [
  { action: "Login ke sistem", time: "Baru saja", icon: <LaptopOutlined /> },
  { action: "Mengubah data pegawai (NIP: 19850310...)", time: "2 jam yang lalu", icon: <EditOutlined /> },
  { action: "Melakukan proses kenaikan gaji berkala (Batch 1)", time: "Hari ini, 09:00", icon: <SafetyCertificateOutlined /> },
  { action: "Ganti Password", time: "Kemarin, 14:00", icon: <KeyOutlined /> },
];

export const AdminProfileSettings: React.FC = () => {
  
  const [adminData, setAdminData] = useState<IAdminProfile>(initialAdminData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  
  const handleOpenEdit = () => {
    form.setFieldsValue(adminData);
    setIsModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);

      
      setTimeout(() => {
        setAdminData((prev) => ({ ...prev, ...values }));
        message.success("Profil administrator berhasil diperbarui");
        setIsLoading(false);
        setIsModalOpen(false);
      }, 1000);
    } catch (error) {
      console.error("Validasi gagal", error);
    }
  };

  

  
  const formFields = [
    { name: "name", label: "Nama Tampilan", icon: <UserOutlined />, required: true, type: "text" },
    { name: "username", label: "Username", icon: <GlobalOutlined />, required: true, type: "text", disabled: true }, 
    { name: "email", label: "Email Pemulihan", icon: <MailOutlined />, required: true, type: "email" },
    { name: "phone", label: "No. Kontak (WA)", icon: <PhoneOutlined />, required: false, type: "text" },
  ];

  
  const profileInfoList = [
    { label: "Username", value: adminData.username, icon: <GlobalOutlined /> },
    { label: "Email", value: adminData.email, icon: <MailOutlined /> },
    { label: "Unit Pengelola", value: adminData.unit, icon: <SafetyCertificateOutlined /> },
    { label: "Kontak", value: adminData.phone, icon: <PhoneOutlined /> },
    { label: "Terakhir Login", value: adminData.lastLogin, icon: <HistoryOutlined /> },
  ];

  
  const securitySettings = [
    { title: "Autentikasi Dua Faktor (2FA)", desc: "Amankan akun dengan verifikasi OTP", checked: true },
    { title: "Notifikasi Login", desc: "Terima email saat ada login baru", checked: false },
    { title: "Sesi Otomatis Berakhir", desc: "Logout otomatis setelah 30 menit inaktif", checked: true },
  ];

  

  
  const AccountTab = () => (
    <div style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
           <Card size="small" variant="borderless" style={{ background: "#f4f8feff" }} title={<Space><UserOutlined /><Text strong>Detail Akun Administrator</Text></Space>}>
              <List
                itemLayout="horizontal"
                dataSource={profileInfoList}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ backgroundColor: "#f0f2f5", color: "#1890ff" }} icon={item.icon} />}
                      title={<Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text>}
                      description={<Text strong style={{ color: "#262626" }}>{item.value}</Text>}
                    />
                  </List.Item>
                )}
              />
           </Card>
        </Col>
      </Row>
    </div>
  );

  

  
  const ActivityTab = () => (
    <div style={{ marginTop: 24, paddingLeft: 12 }}>
      <Timeline
        items={mockActivityLog.map(log => ({
          color: 'blue',
          children: (
            <>
              <Text strong>{log.action}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>{log.time}</Text>
            </>
          ),
          dot: log.icon,
        }))}
      />
    </div>
  );

  return (
    <div style={{ padding: 24, minHeight: "100vh"}}>
      
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 4 }}>Pengaturan Akun</Title>
        <Text type="secondary">Kelola profil administrator dan preferensi sistem Anda</Text>
      </div>

      <Row gutter={[24, 24]}>
        
        <Col xs={24} md={8}>
          <Card variant="borderless" style={{ borderRadius: 16, overflow: "hidden", height: '100%', background: '#f4f8feff' }}>
            <div style={{ 
              height: 120, 
              background: "linear-gradient(135deg, #001529 0%, #003a8c 100%)", 
              margin: "-24px -24px 0", 
              position: "relative" 
            }}>
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                 <Tag color="gold" icon={<SafetyCertificateOutlined />}>{adminData.role}</Tag>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: -60, position: 'relative' }}>
              <Avatar 
                size={110} 
                style={{ backgroundColor: "#003a8c", border: "4px solid white", fontSize: 40 }}
              >
                {adminData.name.charAt(0)}
              </Avatar>
              
              <div style={{ marginTop: 16 }}>
                <Title level={4} style={{ margin: 0 }}>{adminData.name}</Title>
                <Text type="secondary">{adminData.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Badge status="processing" text="Online" />
                </div>
              </div>

              <Divider style={{ margin: "24px 0" }} />

              <Space direction="vertical" style={{ width: "100%" }}>
                <Button type="primary" block icon={<EditOutlined />} onClick={handleOpenEdit} size="large">
                   Edit Profil
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card variant="borderless" style={{ borderRadius: 16, minHeight: "100%" }}>
            <Tabs defaultActiveKey="1" size="large" items={[
              { 
                key: "1", 
                label: <Space><UserOutlined />Profil & Akun</Space>, 
                children: <AccountTab /> 
              },
              { 
                key: "3", 
                label: <Space><HistoryOutlined />Log Aktivitas</Space>, 
                children: <ActivityTab /> 
              },
            ]} />
          </Card>
        </Col>
      </Row>

      <DynamicModal
        title="Ubah Profil Administrator"
        isOpen={isModalOpen}
        onClose={handleCloseEdit}
        onSubmit={handleSaveProfile}
        isLoading={isLoading}
        mode="edit"
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={adminData}>
          <Row gutter={16}>
            {formFields.map((field) => (
              <Col span={24} key={field.name}>
                <Form.Item 
                  label={field.label} 
                  name={field.name}
                  rules={[{ required: field.required, message: `${field.label} wajib diisi` }]}
                >
                  <Input 
                    prefix={field.icon} 
                    disabled={field.disabled}
                    placeholder={`Masukkan ${field.label}`}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
          
          <Divider style={{ margin: "12px 0" }} />
          
          <div style={{ background: "#f0f2f5", padding: 12, borderRadius: 6 }}>
            <Space align="start">
              <GlobalOutlined style={{ color: "#1890ff", marginTop: 4 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Perubahan pada data administrator akan dicatat dalam Log Sistem demi keamanan. Username dan Role hanya dapat diubah oleh Super Admin via Database.
              </Text>
            </Space>
          </div>
        </Form>
      </DynamicModal>

    </div>
  );
};
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Avatar,
  Tabs,
  Tag,
  List,
  Button,
  Space,
  Form,
  Input,
  message,
  Divider,
  Badge,
  Timeline,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
  HistoryOutlined,
  GlobalOutlined,
  KeyOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import { DynamicModal } from "../../components/dynamicModal";

const { Title, Text } = Typography;

// Warna Tema ANRI
const COLORS = {
  navy: "#002347",
  blue: "#00509d",
  bg: "#f8fafc",
  border: "#e2e8f0",
  white: "#ffffff",
};

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
  {
    action: "Mengubah data pegawai (NIP: 19850310...)",
    time: "2 jam yang lalu",
    icon: <EditOutlined />,
  },
  {
    action: "Melakukan proses kenaikan gaji berkala (Batch 1)",
    time: "Hari ini, 09:00",
    icon: <SafetyCertificateOutlined />,
  },
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

  const AccountTab = () => (
    <div style={{ marginTop: 16 }}>
      <Card
        size="small"
        bordered={false}
        style={{
          background: COLORS.bg,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
        }}
        title={
          <Space>
            <UserOutlined style={{ color: COLORS.blue }} />
            <Text strong style={{ color: COLORS.navy }}>
              Detail Akun Administrator
            </Text>
          </Space>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              label: "Username",
              value: adminData.username,
              icon: <GlobalOutlined />,
            },
            { label: "Email", value: adminData.email, icon: <MailOutlined /> },
            {
              label: "Unit Pengelola",
              value: adminData.unit,
              icon: <SafetyCertificateOutlined />,
            },
            {
              label: "Kontak",
              value: adminData.phone,
              icon: <PhoneOutlined />,
            },
            {
              label: "Terakhir Login",
              value: adminData.lastLogin,
              icon: <HistoryOutlined />,
            },
          ]}
          renderItem={(item) => (
            <List.Item style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: "#fff",
                      color: COLORS.blue,
                      border: `1px solid ${COLORS.border}`,
                    }}
                    icon={item.icon}
                  />
                }
                title={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.label}
                  </Text>
                }
                description={
                  <Text strong style={{ color: COLORS.navy }}>
                    {item.value}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const ActivityTab = () => (
    <div style={{ marginTop: 24, paddingLeft: 12 }}>
      <Timeline
        items={mockActivityLog.map((log) => ({
          color: COLORS.blue,
          children: (
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ color: COLORS.navy }}>
                {log.action}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {log.time}
              </Text>
            </div>
          ),
          dot: <span style={{ color: COLORS.blue }}>{log.icon}</span>,
        }))}
      />
    </div>
  );

  return (
    <div
      style={{ padding: 24, minHeight: "100vh", backgroundColor: COLORS.bg }}
    >
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: COLORS.navy }}>
          Pengaturan Akun
        </Title>
        <Text type="secondary">
          Kelola profil administrator dan preferensi sistem Anda
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              height: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                height: 100,
                background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.blue} 100%)`,
                margin: "-24px -24px 0",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <Tag color="gold" style={{ border: "none" }}>
                  {adminData.role}
                </Tag>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: -50,
                position: "relative",
              }}
            >
              <Avatar
                size={100}
                style={{
                  backgroundColor: COLORS.navy,
                  border: "4px solid white",
                  fontSize: 40,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {adminData.name.charAt(0)}
              </Avatar>
              <div style={{ marginTop: 16 }}>
                <Title level={4} style={{ margin: 0, color: COLORS.navy }}>
                  {adminData.name}
                </Title>
                <Text type="secondary">{adminData.email}</Text>
                <div style={{ marginTop: 8 }}>
                  <Badge
                    status="success"
                    text={
                      <Text style={{ color: COLORS.navy, fontSize: 12 }}>
                        Online
                      </Text>
                    }
                  />
                </div>
              </div>
              <Divider style={{ margin: "24px 0" }} />
              <Button
                type="primary"
                block
                icon={<EditOutlined />}
                onClick={handleOpenEdit}
                size="large"
                style={{ backgroundColor: COLORS.blue, borderRadius: 8 }}
              >
                Ubah Profil
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              minHeight: "100%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <Tabs
              defaultActiveKey="1"
              size="large"
              tabBarStyle={{ color: COLORS.navy }}
              items={[
                {
                  key: "1",
                  label: (
                    <Space>
                      <UserOutlined />
                      Profil & Akun
                    </Space>
                  ),
                  children: <AccountTab />,
                },
                {
                  key: "3",
                  label: (
                    <Space>
                      <HistoryOutlined />
                      Log Aktivitas
                    </Space>
                  ),
                  children: <ActivityTab />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <DynamicModal
        title="Ubah Profil Administrator" // Gunakan string langsung tanpa tag <Text>
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProfile}
        isLoading={isLoading}
        mode="edit"
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={adminData}>
          <Row gutter={16}>
            {[
              { name: "name", label: "Nama Tampilan", icon: <UserOutlined /> },
              {
                name: "username",
                label: "Username",
                icon: <GlobalOutlined />,
                disabled: true,
              },
              {
                name: "email",
                label: "Email Pemulihan",
                icon: <MailOutlined />,
              },
              {
                name: "phone",
                label: "No. Kontak (WA)",
                icon: <PhoneOutlined />,
              },
            ].map((field) => (
              <Col span={24} key={field.name}>
                <Form.Item
                  label={
                    <Text strong style={{ color: COLORS.navy }}>
                      {field.label}
                    </Text>
                  }
                  name={field.name}
                >
                  <Input
                    prefix={field.icon}
                    disabled={field.disabled}
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>
          <div
            style={{
              background: COLORS.bg,
              padding: 16,
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Space align="start">
              <GlobalOutlined style={{ color: COLORS.blue, marginTop: 4 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Perubahan data profil akan dicatat dalam Log Sistem. Username
                dan Role hanya dapat diubah oleh otorisasi pusat melalui
                manajemen database.
              </Text>
            </Space>
          </div>
        </Form>
      </DynamicModal>
    </div>
  );
};

import React, { useState } from "react";
import { 
  Row, Col, Card, Typography, Avatar, Tabs, Tag, Table, 
  Button, Space, Badge, Progress, Statistic, Form, Input, 
  message, Divider 
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined,
  CalendarOutlined, TrophyOutlined, ClockCircleOutlined,
  FileTextOutlined, RiseOutlined, BankOutlined, IdcardOutlined,
  EditOutlined, CheckCircleOutlined, ManOutlined, WomanOutlined,
} from "@ant-design/icons";

import { DynamicModal } from "../../components/DynamicModal"; 

const { Title, Text } = Typography;

// --- INTERFACES & MOCK DATA ---
interface IEmployeeProfile {
  name: string;
  nip: string;
  position: string;
  unit: string;
  workPeriodYear: number;
  workPeriodMonth: number;
  tmtCpns: string;
  gender: "L" | "P";
  email: string;
  phone: string;
  address: string;
  status: "Aktif" | "Pensiun" | "Cuti";
}

interface IHistoryRow {
  key: string;
  golongan: string;
  pangkat: string;
  gajiPokok: number;
  tmt: string;
  skNumber: string;
  skDate: string;
  pejabat: string;
}

const initialProfile: IEmployeeProfile = {
  name: "Budi Santoso, S.Kom., M.T.",
  nip: "19850310 200912 1 002",
  position: "Pranata Komputer Ahli Muda",
  unit: "Pusat Data dan Informasi (PUSDATIN) - ANRI",
  workPeriodYear: 14,
  workPeriodMonth: 3,
  tmtCpns: "01 Desember 2009",
  gender: "L",
  email: "budi.santoso@anri.go.id",
  phone: "0812-3456-7890",
  address: "Jl. Ampera Raya No. 7, Cilandak Timur, Jakarta Selatan",
  status: "Aktif",
};

const mockHistory: IHistoryRow[] = [
  {
    key: "1",
    golongan: "III/d",
    pangkat: "Penata Tingkat I",
    gajiPokok: 4200000,
    tmt: "01 April 2023",
    skNumber: "SK-88/ANRI/2023",
    skDate: "15 Maret 2023",
    pejabat: "Kepala ANRI",
  },
  {
    key: "2",
    golongan: "III/c",
    pangkat: "Penata",
    gajiPokok: 3900000,
    tmt: "01 April 2021",
    skNumber: "SK-45/ANRI/2021",
    skDate: "10 Maret 2021",
    pejabat: "Kepala Biro Umum",
  },
];

export const ProfileUserSettings: React.FC = () => {
  // --- STATE ---
  const [profileData, setProfileData] = useState<IEmployeeProfile>(initialProfile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form] = Form.useForm();

  // --- ACTIONS ---
  const handleOpenEdit = () => {
    form.setFieldsValue(profileData);
    setIsModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSaveData = async () => {
    try {
      const values = await form.validateFields();
      setIsLoading(true);
      setTimeout(() => {
        setProfileData((prev) => ({ ...prev, ...values }));
        message.success("Data diri berhasil diperbaharui!");
        setIsLoading(false);
        setIsModalOpen(false);
      }, 1500);
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  // --- HELPERS ---
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

  const calculateNextKGB = () => {
    const lastTMT = new Date("2023-04-01");
    const nextKGB = new Date(lastTMT.setFullYear(lastTMT.getFullYear() + 2));
    return nextKGB.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const calculateKGBProgress = () => {
    const lastTMT = new Date("2023-04-01");
    const now = new Date();
    const nextKGB = new Date(new Date(lastTMT).setFullYear(lastTMT.getFullYear() + 2));
    const totalDays = (nextKGB.getTime() - lastTMT.getTime()) / (86400000);
    const daysPassed = (now.getTime() - lastTMT.getTime()) / (86400000);
    return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  };

  // --- CONFIGURATIONS (Untuk Looping/Mapping) ---

  // 1. Config Form Fields
  const formSections = [
    {
      title: "Data Kepegawaian (Tidak dapat diubah)",
      fields: [
        { name: "name", label: "Nama Lengkap", icon: <UserOutlined />, disabled: true, span: 24, rules: [] },
        { name: "nip", label: "NIP", icon: <IdcardOutlined />, disabled: true, span: 12, rules: [] },
        { name: "position", label: "Jabatan", icon: <TrophyOutlined />, disabled: true, span: 12, rules: [] },
      ]
    },
    {
      title: "Kontak & Alamat (Dapat diubah)",
      fields: [
        { name: "email", label: "Email Kedinasan", icon: <MailOutlined />, disabled: false, span: 12, rules: [{ required: true, type: 'email' as const, message: 'Email tidak valid' }] },
        { name: "phone", label: "Nomor Telepon / WA", icon: <PhoneOutlined />, disabled: false, span: 12, rules: [{ required: true, message: 'Wajib diisi' }] },
        { name: "address", label: "Alamat Domisili Saat Ini", icon: null, disabled: false, span: 24, type: "textarea", rules: [{ required: true, message: 'Wajib diisi' }] },
      ]
    }
  ];

  // 2. Config Personal Info Tab Cards
  const personalInfoGroups = [
    {
      key: "identitas",
      title: "Identitas Diri",
      icon: <UserOutlined style={{ color: "#1890ff", fontSize: 18 }} />,
      items: [
        { label: "Nama Lengkap", content: <Text strong style={{ fontSize: 15 }}>{profileData.name}</Text>, span: 12 },
        { label: "Jenis Kelamin", content: <Tag icon={profileData.gender === "L" ? <ManOutlined /> : <WomanOutlined />} color={profileData.gender === "L" ? "blue" : "magenta"}>{profileData.gender === "L" ? "Laki-laki" : "Perempuan"}</Tag>, span: 12 },
        { label: "Email", icon: <MailOutlined />, content: <Text style={{ fontSize: 14 }}>{profileData.email}</Text>, span: 12 },
        { label: "No. Telepon", icon: <PhoneOutlined />, content: <Text style={{ fontSize: 14 }}>{profileData.phone}</Text>, span: 12 },
        { label: "Alamat Rumah", icon: <EnvironmentOutlined />, content: <Text style={{ fontSize: 14 }}>{profileData.address}</Text>, span: 24 },
      ]
    },
    {
      key: "unit",
      title: "Unit Kerja & Masa Kerja",
      icon: <BankOutlined style={{ color: "#52c41a", fontSize: 18 }} />,
      items: [
        { label: "Unit Kerja", content: <Text strong style={{ fontSize: 14 }}>{profileData.unit}</Text>, span: 12 },
        { label: "Masa Kerja Golongan", icon: <ClockCircleOutlined />, content: <Text strong style={{ color: "#1890ff", fontSize: 16 }}>{profileData.workPeriodYear} Tahun {profileData.workPeriodMonth} Bulan</Text>, span: 12 },
        { label: "TMT CPNS", icon: <CalendarOutlined />, content: <Text style={{ fontSize: 14 }}>{profileData.tmtCpns}</Text>, span: 12 },
        { label: "Status Pegawai", icon: <CheckCircleOutlined />, content: <Badge status="success" text={profileData.status} />, span: 12 },
      ]
    }
  ];

  // 3. Config Sidebar Stats
  const sidebarStats = [
    { title: "Golongan", value: mockHistory[0].golongan, icon: <TrophyOutlined />, color: "#1890ff", size: 20 },
    { title: "Masa Kerja", value: `${profileData.workPeriodYear}th ${profileData.workPeriodMonth}bl`, icon: <ClockCircleOutlined />, color: "#52c41a", size: 18 },
  ];

  // 4. Config Sidebar Details
  const sidebarDetails = [
    { label: "NIP", value: profileData.nip, icon: <IdcardOutlined />, color: "inherit", copyable: true },
    { label: "Gaji Pokok", value: formatCurrency(mockHistory[0].gajiPokok), icon: <FileTextOutlined />, color: "#52c41a", copyable: false },
  ];

  // --- SUB-COMPONENTS ---
  const PersonalInfoTab = () => (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      {personalInfoGroups.map((group) => (
        <Col span={24} key={group.key}>
          <Card 
            size="small" 
            variant="borderless" 
            style={{ background: "#fafafa" }}
            title={<Space>{group.icon}<Text strong>{group.title}</Text></Space>}
          >
            <Row gutter={[24, 16]}>
              {group.items.map((item, idx) => (
                <Col xs={24} md={item.span} key={idx}>
                  <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    <div>
                      {item.icon ? (
                        <Space><div style={{ color: "#8c8c8c" }}>{item.icon}</div><Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text></Space>
                      ) : (
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text>
                      )}
                      <div>{item.content}</div>
                    </div>
                  </Space>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const HistoryTab = () => (
    <div style={{ marginTop: 16 }}>
      <Card size="small" variant="borderless" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", marginBottom: 16, color: "white" }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Progress Kenaikan Gaji Berkala Berikutnya</Text>
              <Text strong style={{ color: "white", fontSize: 16 }}>{calculateNextKGB()}</Text>
            </Space>
          </Col>
          <Col>
            <Progress type="circle" percent={calculateKGBProgress()} width={60} strokeColor="#52c41a" format={(percent) => `${percent}%`} />
          </Col>
        </Row>
      </Card>
      <Card size="small" variant="borderless" style={{ background: "#e6f7ff", marginBottom: 16 }}>
        <Space><RiseOutlined style={{ color: "#1890ff", fontSize: 16 }} /><Text style={{ fontSize: 13 }}>Data di bawah ini digunakan sebagai dasar perhitungan <Text strong>Kenaikan Gaji Berkala (KGB)</Text></Text></Space>
      </Card>
      
      <Table 
        columns={[
          { title: "Pangkat / Golongan", dataIndex: "golongan", key: "golongan", render: (text, record) => (<Space direction="vertical" size={0}><Text strong style={{ fontSize: 15 }}>{text}</Text><Text type="secondary" style={{ fontSize: 13 }}>{record.pangkat}</Text></Space>) },
          { title: "Gaji Pokok", dataIndex: "gajiPokok", key: "gajiPokok", render: (value) => <Text strong style={{ color: "#52c41a", fontSize: 14 }}>{formatCurrency(value)}</Text> },
          { title: "TMT Berlaku", dataIndex: "tmt", key: "tmt", render: (text) => <Space><CalendarOutlined style={{ color: "#1890ff" }} /><Text>{text}</Text></Space> },
          { title: "Nomor SK", dataIndex: "skNumber", key: "skNumber", responsive: ["md"], render: (text, record) => (<Space direction="vertical" size={0}><Text>{text}</Text><Text type="secondary" style={{ fontSize: 12 }}>{record.skDate}</Text></Space>) },
          { title: "Pejabat", dataIndex: "pejabat", key: "pejabat", responsive: ["lg"] },
        ]} 
        dataSource={mockHistory} 
        pagination={false} 
        size="middle" 
        style={{ background: "white" }} 
      />
    </div>
  );

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
      
      {/* --- DYNAMIC MODAL & FORM --- */}
      <DynamicModal
        title="Ubah Data Diri"
        isOpen={isModalOpen}
        onClose={handleCloseEdit}
        onSubmit={handleSaveData}
        isLoading={isLoading}
        mode="edit"
        width={700}
      >
        <Form form={form} layout="vertical" initialValues={profileData}>
          {formSections.map((section, index) => (
            <div key={index}>
              <Divider orientation="left" style={{ marginTop: index === 0 ? 0 : 24, fontSize: 14 }}>
                {section.title}
              </Divider>
              <Row gutter={16}>
                {section.fields.map((field) => (
                  <Col span={field.span} key={field.name}>
                    <Form.Item label={field.label} name={field.name} rules={field.rules}>
                      {field.type === "textarea" ? (
                        <Input.TextArea rows={3} showCount maxLength={200} placeholder="Masukkan alamat lengkap..." />
                      ) : (
                        <Input 
                          disabled={field.disabled} 
                          prefix={field.icon} 
                          style={field.disabled ? { color: '#333' } : undefined} 
                        />
                      )}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Form>
      </DynamicModal>

      {/* --- HEADER --- */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 4 }}>Profil Pegawai</Title>
        <Text type="secondary" style={{ fontSize: 14 }}>Kelola informasi data diri dan riwayat kepegawaian Anda</Text>
      </div>

      <Row gutter={[24, 24]}>
        
        {/* --- LEFT PROFILE CARD --- */}
        <Col xs={24} lg={8}>
          <Card variant="borderless" style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ height: 120, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", marginTop: -24, marginLeft: -24, marginRight: -24, position: "relative" }}>
              <div style={{ position: "absolute", bottom: -50, left: "50%", transform: "translateX(-50%)" }}>
                <Avatar size={100} src="https://i.pravatar.cc/300" style={{ border: "4px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} />
              </div>
            </div>

            <div style={{ marginTop: 60, textAlign: "center" }}>
              <Title level={4} style={{ margin: 0, marginBottom: 4 }}>{profileData.name}</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>{profileData.position}</Text>

              {/* Looping Statistics */}
              <Row gutter={8} style={{ marginTop: 24, marginBottom: 24 }}>
                {sidebarStats.map((stat, idx) => (
                  <Col span={12} key={idx}>
                    <Card size="small" style={{ background: "#f5f5f5", border: "none" }}>
                      <Statistic 
                        title={<Text style={{ fontSize: 12 }}>{stat.title}</Text>} 
                        value={stat.value} 
                        valueStyle={{ fontSize: stat.size, color: stat.color }} 
                        prefix={stat.icon} 
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Looping Detail Items */}
              <div style={{ background: "#fafafa", padding: "12px 16px", borderRadius: 8, marginBottom: 16 }}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  {sidebarDetails.map((detail, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <span style={{ marginRight: 4 }}>{detail.icon}</span>{detail.label}
                      </Text>
                      <Text strong copyable={detail.copyable} style={{ fontSize: 13, color: detail.color }}>
                        {detail.value}
                      </Text>
                    </div>
                  ))}
                </Space>
              </div>

              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                size="large" 
                block 
                style={{ borderRadius: 8, height: 44 }}
                onClick={handleOpenEdit}
              >
                Ubah Data Diri
              </Button>
            </div>
          </Card>
        </Col>

        {/* --- RIGHT TABS CONTENT --- */}
        <Col xs={24} lg={16}>
          <Card variant="borderless" style={{ borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", minHeight: "100%" }}>
            <Tabs defaultActiveKey="1" size="large" items={[
                { key: "1", label: (<Space><UserOutlined /><span>Data Diri & Pekerjaan</span></Space>), children: <PersonalInfoTab /> },
                { key: "2", label: (<Space><TrophyOutlined /><span>Riwayat Pangkat & Gaji</span></Space>), children: <HistoryTab /> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
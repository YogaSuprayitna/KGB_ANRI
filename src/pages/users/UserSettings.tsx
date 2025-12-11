import React from "react";
import { Row, Col, Card, Typography, Avatar, Tabs, Tag, Table, Button, Space, Badge, Progress, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import {UserOutlined, MailOutlined,PhoneOutlined,EnvironmentOutlined,CalendarOutlined,TrophyOutlined,ClockCircleOutlined,FileTextOutlined,RiseOutlined,BankOutlined,IdcardOutlined,EditOutlined,CheckCircleOutlined,ManOutlined,WomanOutlined,} from "@ant-design/icons";

const { Title, Text } = Typography;

// --- INTERFACES ---
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

// --- MOCK DATA ---
const mockProfile: IEmployeeProfile = {
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
  {
    key: "3",
    golongan: "III/b",
    pangkat: "Penata Muda Tingkat I",
    gajiPokok: 3500000,
    tmt: "01 April 2019",
    skNumber: "SK-12/ANRI/2019",
    skDate: "05 Maret 2019",
    pejabat: "Kepala Biro Umum",
  },
];

export const ProfileUserSettings: React.FC = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate next KGB date (2 years from last TMT)
  const calculateNextKGB = () => {
    const lastTMT = new Date("2023-04-01");
    const nextKGB = new Date(lastTMT);
    nextKGB.setFullYear(lastTMT.getFullYear() + 2);
    return nextKGB.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  // Calculate progress to next KGB
  const calculateKGBProgress = () => {
    const lastTMT = new Date("2023-04-01");
    const now = new Date();
    const nextKGB = new Date(lastTMT);
    nextKGB.setFullYear(lastTMT.getFullYear() + 2);

    const totalDays = (nextKGB.getTime() - lastTMT.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (now.getTime() - lastTMT.getTime()) / (1000 * 60 * 60 * 24);

    return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  };

  const historyColumns: ColumnsType<IHistoryRow> = [
    {
      title: "Pangkat / Golongan",
      dataIndex: "golongan",
      key: "golongan",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 15 }}>
            {text}
          </Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {record.pangkat}
          </Text>
        </Space>
      ),
    },
    {
      title: "Gaji Pokok",
      dataIndex: "gajiPokok",
      key: "gajiPokok",
      render: (value) => (
        <Text strong style={{ color: "#52c41a", fontSize: 14 }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "TMT Berlaku",
      dataIndex: "tmt",
      key: "tmt",
      render: (text) => (
        <Space>
          <CalendarOutlined style={{ color: "#1890ff" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Nomor SK",
      dataIndex: "skNumber",
      key: "skNumber",
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.skDate}
          </Text>
        </Space>
      ),
      responsive: ["md"],
    },
    {
      title: "Pejabat",
      dataIndex: "pejabat",
      key: "pejabat",
      responsive: ["lg"],
    },
  ];

  const PersonalInfoTab = () => (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      {/* Identitas Diri */}
      <Col span={24}>
        <Card
          size="small"
          title={
            <Space>
              <UserOutlined style={{ color: "#1890ff", fontSize: 18 }} />
              <Text strong>Identitas Diri</Text>
            </Space>
          }
          bordered={false}
          style={{ background: "#fafafa" }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Nama Lengkap
                  </Text>
                  <div>
                    <Text strong style={{ fontSize: 15 }}>
                      {mockProfile.name}
                    </Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Jenis Kelamin
                  </Text>
                  <div>
                    <Tag icon={mockProfile.gender === "L" ? <ManOutlined /> : <WomanOutlined />} color={mockProfile.gender === "L" ? "blue" : "magenta"}>
                      {mockProfile.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </Tag>
                  </div>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div>
                  <Space>
                    <MailOutlined style={{ color: "#8c8c8c" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Email
                    </Text>
                  </Space>
                  <div>
                    <Text style={{ fontSize: 14 }}>{mockProfile.email}</Text>
                  </div>
                </div>
                <div>
                  <Space>
                    <PhoneOutlined style={{ color: "#8c8c8c" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      No. Telepon
                    </Text>
                  </Space>
                  <div>
                    <Text style={{ fontSize: 14 }}>{mockProfile.phone}</Text>
                  </div>
                </div>
              </Space>
            </Col>
            <Col span={24}>
              <Space>
                <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Alamat Rumah
                </Text>
              </Space>
              <div>
                <Text style={{ fontSize: 14 }}>{mockProfile.address}</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Unit Kerja */}
      <Col span={24}>
        <Card
          size="small"
          title={
            <Space>
              <BankOutlined style={{ color: "#52c41a", fontSize: 18 }} />
              <Text strong>Unit Kerja & Masa Kerja</Text>
            </Space>
          }
          bordered={false}
          style={{ background: "#fafafa" }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div>
                  <Space>
             
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Unit Kerja
                    </Text>
                  </Space>
                  <div>
                    <Text strong style={{ fontSize: 14 }}>
                      {mockProfile.unit}
                    </Text>
                  </div>
                </div>
                <div>
                  <Space>
                    <CalendarOutlined style={{ color: "#8c8c8c" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      TMT CPNS
                    </Text>
                  </Space>
                  <div>
                    <Text style={{ fontSize: 14 }}>{mockProfile.tmtCpns}</Text>
                  </div>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div>
                  <Space>
                    <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Masa Kerja Golongan
                    </Text>
                  </Space>
                  <div>
                    <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                      {mockProfile.workPeriodYear} Tahun {mockProfile.workPeriodMonth} Bulan
                    </Text>
                  </div>
                </div>
                <div>
                  <Space>
                    <CheckCircleOutlined style={{ color: "#8c8c8c" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Status Pegawai
                    </Text>
                  </Space>
                  <div>
                    <Badge status="success" text={mockProfile.status} />
                  </div>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const HistoryTab = () => (
    <div style={{ marginTop: 16 }}>
      <Card
        size="small"
        bordered={false}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          marginBottom: 16,
          color: "white",
        }}
      >
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Progress Kenaikan Gaji Berkala Berikutnya</Text>
              <Text strong style={{ color: "white", fontSize: 16 }}>
                {calculateNextKGB()}
              </Text>
            </Space>
          </Col>
          <Col>
            <Progress type="circle" percent={calculateKGBProgress()} width={60} strokeColor="#52c41a" format={(percent) => `${percent}%`} />
          </Col>
        </Row>
      </Card>

      <Card size="small" bordered={false} style={{ background: "#e6f7ff", marginBottom: 16 }}>
        <Space>
          <RiseOutlined style={{ color: "#1890ff", fontSize: 16 }} />
          <Text style={{ fontSize: 13 }}>
            Data di bawah ini digunakan sebagai dasar perhitungan <Text strong>Kenaikan Gaji Berkala (KGB)</Text>
          </Text>
        </Space>
      </Card>

      <Table columns={historyColumns} dataSource={mockHistory} pagination={false} size="middle" style={{ background: "white" }} />
    </div>
  );

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
          Profil Pegawai
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Kelola informasi data diri dan riwayat kepegawaian Anda
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Profile Card */}
        <Col xs={24} lg={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header Gradient */}
            <div
              style={{
                height: 120,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginTop: -24,
                marginLeft: -24,
                marginRight: -24,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: -50,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <Avatar
                  size={100}
                  src="https://i.pravatar.cc/300"
                  style={{
                    border: "4px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ marginTop: 60, textAlign: "center" }}>
              <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                {mockProfile.name}
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {mockProfile.position}
              </Text>

              {/* Quick Stats */}
              <Row gutter={8} style={{ marginTop: 24, marginBottom: 24 }}>
                <Col span={12}>
                  <Card size="small" style={{ background: "#f5f5f5", border: "none" }}>
                    <Statistic title={<Text style={{ fontSize: 12 }}>Golongan</Text>} value={mockHistory[0].golongan} valueStyle={{ fontSize: 20, color: "#1890ff" }} prefix={<TrophyOutlined />} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ background: "#f5f5f5", border: "none" }}>
                    <Statistic
                      title={<Text style={{ fontSize: 12 }}>Masa Kerja</Text>}
                      value={`${mockProfile.workPeriodYear}th ${mockProfile.workPeriodMonth}bl`}
                      valueStyle={{ fontSize: 18, color: "#52c41a" }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Card>
                </Col>
              </Row>

              {/* NIP Info */}
              <div
                style={{
                  background: "#fafafa",
                  padding: "12px 16px",
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <IdcardOutlined style={{ marginRight: 4 }} />
                      NIP
                    </Text>
                    <Text strong copyable style={{ fontSize: 13 }}>
                      {mockProfile.nip}
                    </Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <FileTextOutlined style={{ marginRight: 4 }} />
                      Gaji Pokok
                    </Text>
                    <Text strong style={{ fontSize: 13, color: "#52c41a" }}>
                      {formatCurrency(mockHistory[0].gajiPokok)}
                    </Text>
                  </div>
                </Space>
              </div>

              {/* Action Button */}
              <Button type="primary" icon={<EditOutlined />} size="large" block style={{ borderRadius: 8, height: 44 }}>
                Permintaan Ubah Data
              </Button>
            </div>
          </Card>
        </Col>

        {/* Content Tabs */}
        <Col xs={24} lg={16}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              minHeight: "100%",
            }}
          >
            <Tabs
              defaultActiveKey="1"
              size="large"
              items={[
                {
                  key: "1",
                  label: (
                    <Space>
                      <UserOutlined />
                      <span>Data Diri & Pekerjaan</span>
                    </Space>
                  ),
                  children: <PersonalInfoTab />,
                },
                {
                  key: "2",
                  label: (
                    <Space>
                      <TrophyOutlined />
                      <span>Riwayat Pangkat & Gaji</span>
                    </Space>
                  ),
                  children: <HistoryTab />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

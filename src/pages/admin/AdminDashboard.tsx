import React from "react";
import { Card, Col, Row, Statistic, Table, Tag, Typography, List, Avatar, Button, Progress, Space, Badge } from "antd";
import { UserOutlined, RiseOutlined, HistoryOutlined, FileProtectOutlined, BellOutlined, ArrowRightOutlined, ClockCircleOutlined, CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import "../../styles/dashboardAdmin.css";

const { Title, Text } = Typography;

// --- MOCK DATA ---
const mockStats = {
  activeEmployees: 1240,
  upcomingKGB: 45,
  ongoingProcess: 12,
  pendingSK: 5,
};

const upcomingKGBData = [
  { key: "1", name: "Budi Santoso", nip: "19800101...", currentRank: "III/a", tmt: "01-02-2026", progress: 75, status: "Verifikasi SDM" },
  { key: "2", name: "Siti Aminah", nip: "19850505...", currentRank: "III/c", tmt: "01-03-2026", progress: 40, status: "Menunggu Berkas" },
  { key: "3", name: "Rahmat Hidayat", nip: "19901010...", currentRank: "II/d", tmt: "01-03-2026", progress: 90, status: "Paraf Pejabat" },
];

const skNotifications = [
  { id: 1, title: "SK Siap Cetak: Ahmad Fauzi", desc: "Periode April 2026", time: "2 jam lalu" },
  { id: 2, title: "SK Siap Cetak: Dewi Lestari", desc: "Periode April 2026", time: "5 jam lalu" },
  { id: 3, title: "Tanda Tangan Tertunda", desc: "Berkas Pak Joko perlu review", time: "1 hari lalu" },
];

const historyData = [
  { key: "1", name: "Indra Wijaya", tmt: "01-01-2026", type: "KGB", skNumber: "SK/881/2026", status: "Selesai" },
  { key: "2", name: "Ratna Sari", tmt: "01-01-2026", type: "KGB", skNumber: "SK/882/2026", status: "Selesai" },
  { key: "3", name: "Eko Prasetyo", tmt: "01-12-2025", type: "KGB", skNumber: "SK/750/2025", status: "Selesai" },
  { key: "4", name: "Eko Prasetyo", tmt: "01-12-2025", type: "KGB", skNumber: "SK/750/2025", status: "Selesai" },
  { key: "5", name: "Eko Prasetyo", tmt: "01-12-2025", type: "KGB", skNumber: "SK/750/2025", status: "Selesai" },
];

// --- COMPONENT ---
export const AdminDashboard: React.FC = () => {
  const { list } = useNavigation();

  // Kolom Table
  const processColumns = [
    {
      title: "Nama Pegawai",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            NIP: {record.nip}
          </Text>
        </Space>
      ),
    },
    { title: "TMT Baru", dataIndex: "tmt", key: "tmt" },
    {
      title: "Status & Progres",
      key: "status",
      render: (_: any, record: any) => (
        <div style={{ minWidth: 150 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: 12 }}>{record.status}</Text>
            <Text style={{ fontSize: 12 }}>{record.progress}%</Text>
          </div>
          <Progress percent={record.progress} size="small" showInfo={false} strokeColor={record.progress > 80 ? "#52c41a" : "#1890ff"} />
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: () => (
        <Button type="link" size="small">
          Detail
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="dashboard-container">
        {/* 1. HEADER */}
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={2} style={{ margin: 0, color: "#1f1f1f" }}>
              Dashboard KGB
            </Title>
            <Text type="secondary">Arsip Nasional Republik Indonesia (ANRI)</Text>
          </div>
          <Button type="primary" size="large" icon={<RiseOutlined />} style={{ borderRadius: "8px" }}>
            Proses KGB Baru
          </Button>
        </div>

        {/* 2. STATISTIC CARDS */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          {/* Card 1: Pegawai Aktif */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="dashboard-card" variant="borderless">
              <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                <Statistic title="Pegawai Aktif" value={mockStats.activeEmployees} groupSeparator="." />
                <div className="stat-icon-box" style={{ backgroundColor: "#1890ff" }}>
                  <UserOutlined />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Card 2: KGB Segera */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="dashboard-card" variant="borderless">
              <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                <Statistic title="KGB (1-3 Bulan)" value={mockStats.upcomingKGB} valueStyle={{ color: "#faad14" }} />
                <div className="stat-icon-box" style={{ backgroundColor: "#faad14" }}>
                  <ClockCircleOutlined />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Card 3: Sedang Proses */}
          <Col xs={24} sm={12} lg={6}>
            <Card className="dashboard-card" variant="borderless">
              <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                <Statistic title="Sedang Diproses" value={mockStats.ongoingProcess} />
                <div className="stat-icon-box" style={{ backgroundColor: "#52c41a" }}>
                  <SyncOutlined />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Card 4: Priority Alert (SK Harus Terbit) */}
          <Col xs={24} sm={12} lg={6}>
            {/* Menggunakan class khusus .priority-card */}
            <Card className="dashboard-card priority-card" variant="borderless">
              <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
                <Statistic title="SK Harus Terbit" value={mockStats.pendingSK} valueStyle={{ color: "#cf1322" }} />
                <div className="stat-icon-box" style={{ backgroundColor: "#ff4d4f", boxShadow: "none" }}>
                  <FileProtectOutlined />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* 3. MAIN CONTENT (LEFT) */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* A. Proses KGB Berjalan */}
              <Card
                title={
                  <Space>
                    <SyncOutlined style={{ color: "#1890ff" }} /> Proses KGB Sedang Berjalan
                  </Space>
                }
                className="dashboard-card"
                variant="borderless"
                extra={<Button type="link">Lihat Semua</Button>}
              >
                <Table dataSource={upcomingKGBData} columns={processColumns} pagination={false} size="small" />
              </Card>

              {/* B. Riwayat KGB Terakhir */}
              <Card
                title={
                  <Space>
                    <HistoryOutlined style={{ color: "#722ed1" }} /> Riwayat KGB Terakhir
                  </Space>
                }
                className="dashboard-card"
                variant="borderless"
              >
                <Table
                  dataSource={historyData}
                  pagination={false}
                  size="small"
                  columns={[
                    { title: "Nama", dataIndex: "name", key: "name" },
                    { title: "No. SK", dataIndex: "skNumber", key: "skNumber", render: (text) => <Tag color="blue">{text}</Tag> },
                    { title: "TMT", dataIndex: "tmt", key: "tmt" },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      render: () => (
                        <Tag icon={<CheckCircleOutlined />} color="success">
                          Selesai
                        </Tag>
                      ),
                    },
                  ]}
                />
              </Card>
            </Space>
          </Col>

          {/* 4. SIDEBAR (RIGHT) */}
          <Col xs={24} lg={8}>
            {/* C. Notifikasi SK */}
            <Card
              title={
                <Space>
                  <BellOutlined style={{ color: "#faad14" }} /> Notifikasi SK Penting
                </Space>
              }
              className="dashboard-card"
              variant="borderless"
              // Kita override padding khusus untuk list agar mepet ke pinggir
              style={{ padding: 0, overflow: "hidden" }}
            >
              <List
                itemLayout="horizontal"
                dataSource={skNotifications}
                renderItem={(item) => (
                  <List.Item
                    className="notification-item"
                    actions={[
                      <Button type="primary" ghost size="small">
                        Cetak
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot status="processing">
                          <Avatar icon={<FileProtectOutlined />} style={{ backgroundColor: "#fff2e8", color: "#fa541c" }} />
                        </Badge>
                      }
                      title={<Text strong>{item.title}</Text>}
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.desc}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            {item.time}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
              <div style={{ padding: "12px 24px", textAlign: "center" }}>
                <Button type="link" size="small">
                  Lihat Semua Notifikasi <ArrowRightOutlined />
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AdminDashboard;

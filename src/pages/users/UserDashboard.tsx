import React, { useMemo, useState } from "react";
import {
  Row, Col, Card, Avatar, Tag, Button, List, Table, Progress, Space, Typography, Badge, Divider,
} from "antd";
import {
  UserOutlined, ClockCircleOutlined, HistoryOutlined, BellOutlined,
  FileProtectOutlined, RiseOutlined, TrophyOutlined, CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../../styles/UserDashboard.css";

const { Text, Title } = Typography;

const UserDashboard: React.FC = () => {
  const { data: identity, isLoading } = useGetIdentity<{ name?: string; role?: string; nip?: string }>();
  const navigate = useNavigate();

  const [profile] = useState({
    name: identity?.name ?? "Nama Pengguna",
    nip: identity?.nip ?? "19870101 200301 1 001",
    rank: "III/a - Penata Muda",
    currentSalary: 5200000,
    lastIncrease: "2024-12-01",
    increasePercent: 5,
  });

  const upcoming = useMemo(() => [{ key: "u1", tmt: "01-12-2025", status: "Verifikasi SDM", progress: 45, note: "Sedang diperiksa pusat" }], []);
  const history = useMemo(() => [
    { key: "h1", date: "01-12-2024", oldSalary: 4800000, newSalary: 5040000, percent: 5 },
    { key: "h2", date: "01-12-2023", oldSalary: 4560000, newSalary: 4800000, percent: 5 },
  ], []);

  const notifications = useMemo(() => [
    { id: 1, title: "Berkas KGB diterima", time: "2 hari lalu" },
    { id: 2, title: "SK Siap Cetak", time: "1 minggu lalu" },
  ], []);

  const documents = [
    { id: "d1", title: "SK Kenaikan Terakhir (2024)", status: "Tersedia", color: "#52c41a" },
    { id: "d2", title: "Formulir Pengajuan KGB", status: "Perlu Update", color: "#faad14" },
  ];

  if (isLoading) return <div className="ud-loading">Memuat...</div>;

  const formatCurrency = (v: number) => v.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

  const nextIncreaseDate = useMemo(() => {
    const d = new Date(profile.lastIncrease);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }, [profile.lastIncrease]);

  const handleGeneratePDF = (title: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 35, 71); // Navy color
    doc.text("ARSIP NASIONAL REPUBLIK INDONESIA", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Dokumen: ${title}`, 20, 30);
    doc.text(`NIP: ${profile.nip}`, 20, 37);
    doc.line(20, 45, 190, 45);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="user-dashboard-container">
      {/* HEADER */}
      <div className="ud-header-section">
        <div>
          <Title level={2} className="ud-main-title">Halo, {profile.name.split(' ')[0]}!</Title>
          <Text className="ud-sub-title">Pantau status Kenaikan Gaji Berkala Anda di sini.</Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<RiseOutlined />} 
          className="btn-primary-solid"
          onClick={() => navigate("/ajukan-kgb")}
        >
          Ajukan KGB Baru
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* LEFT COLUMN: PROFILE & STATS */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Card className="ud-profile-card" variant="borderless">
              <div className="ud-profile-content">
                <Avatar size={100} icon={<UserOutlined />} className="ud-avatar-blue" />
                <Title level={4} style={{ margin: "16px 0 4px 0", color: "#002347" }}>{profile.name}</Title>
                <Text type="secondary">{profile.nip}</Text>
                <Tag color="blue" className="ud-rank-tag">{profile.rank}</Tag>
                
                <Divider />
                
                <div className="ud-salary-info">
                  <Text className="ud-salary-label">Gaji Saat Ini</Text>
                  <Title level={3} className="ud-salary-amount">{formatCurrency(profile.currentSalary)}</Title>
                </div>

                <div className="ud-next-schedule">
                  <CalendarOutlined style={{ color: "#00509d", marginRight: 8 }} />
                  <Text>Jadwal Berikutnya: </Text>
                  <Text strong>{nextIncreaseDate.toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}</Text>
                </div>

                <Button block className="ud-btn-outline" onClick={() => navigate("/user-settings")}>
                  Pengaturan Profil
                </Button>
              </div>
            </Card>

            <Card title={<Space><BellOutlined /> <Text strong>Notifikasi Terbaru</Text></Space>} variant="borderless" className="ud-card-shadow">
              <List
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item className="ud-notif-item">
                    <List.Item.Meta
                      avatar={<Badge dot status="processing"><Avatar size="small" icon={<ClockCircleOutlined />} /></Badge>}
                      title={<Text strong style={{ fontSize: 13 }}>{item.title}</Text>}
                      description={<Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>

        {/* RIGHT COLUMN: TABLES & DOCUMENTS */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {/* JADWAL AKTIF */}
            <Card title={<Space><ClockCircleOutlined /> <Text strong>Proses KGB Berjalan</Text></Space>} variant="borderless" className="ud-card-shadow">
              <Table 
                dataSource={upcoming} 
                pagination={false} 
                size="middle"
                columns={[
                  { title: "TMT", dataIndex: "tmt", key: "tmt", render: (t) => <Text strong>{t}</Text> },
                  { title: "STATUS", dataIndex: "status", key: "status", render: (s) => <Tag color="warning">{s}</Tag> },
                  { 
                    title: "PROGRES", 
                    key: "progress", 
                    render: (_, r) => (
                      <div style={{ width: 150 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 11 }}>{r.note}</Text>
                          <Text strong style={{ fontSize: 11 }}>{r.progress}%</Text>
                        </div>
                        <Progress percent={r.progress} size="small" showInfo={false} strokeColor="#00509d" />
                      </div>
                    ) 
                  },
                ]}
              />
            </Card>

            {/* RIWAYAT */}
            <Card title={<Space><HistoryOutlined /> <Text strong>Riwayat Kenaikan Gaji</Text></Space>} variant="borderless" className="ud-card-shadow">
              <Table 
                dataSource={history} 
                pagination={false} 
                size="middle"
                columns={[
                  { title: "TANGGAL", dataIndex: "date", key: "date" },
                  { title: "GAJI LAMA", dataIndex: "oldSalary", render: (v) => formatCurrency(v) },
                  { title: "GAJI BARU", dataIndex: "newSalary", render: (v) => <Text strong style={{ color: "#00509d" }}>{formatCurrency(v)}</Text> },
                  { title: "NAIK", dataIndex: "percent", render: (p) => <Tag color="green">+{p}%</Tag> },
                ]}
              />
            </Card>

            {/* DOKUMEN */}
            <Card title={<Space><FileProtectOutlined /> <Text strong>Arsip Digital & SK</Text></Space>} variant="borderless" className="ud-card-shadow">
              <List
                dataSource={documents}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => handleGeneratePDF(item.title)} icon={<FileProtectOutlined />}>
                        Unduh SK
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={<Text strong>{item.title}</Text>}
                      description={<Tag color={item.color === "#52c41a" ? "success" : "warning"}>{item.status}</Tag>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboard;
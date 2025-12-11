import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Avatar,
  Tag,
  Statistic,
  Button,
  List,
  Table,
  Progress,
  Space,
  Typography,
  Badge,
  Divider,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  BellOutlined,
  FileProtectOutlined,
  RiseOutlined,
  TrophyOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useGetIdentity, useLogout } from "@refinedev/core";

// ➕ Tambahan untuk navigasi ke UserSettings
import { useNavigate } from "react-router-dom";

import "../../styles/UserDashboard.css";

const { Text, Title } = Typography;

const UserDashboard: React.FC = () => {
  const { data: identity, isLoading } = useGetIdentity<{ name?: string; role?: string; nip?: string }>();
  const { mutate: logout } = useLogout();

  // ➕ Inisialisasi Navigate
  const navigate = useNavigate();

  const [profile] = useState({
    name: identity?.name ?? "Nama Pengguna",
    nip: identity?.nip ?? "19870101 200301 1 001",
    rank: "III/a",
    currentSalary: 5200000,
    lastIncrease: "2024-12-01",
    increasePercent: 5,
  });

  const upcoming = useMemo(
    () => [{ key: "u1", tmt: "01-12-2025", status: "Menunggu Berkas", progress: 45, note: "Ajukan ke BKD" }],
    []
  );

  const history = useMemo(
    () => [
      { key: "h1", date: "01-12-2024", oldSalary: 4800000, newSalary: 5040000, percent: 5 },
      { key: "h2", date: "01-12-2023", oldSalary: 4560000, newSalary: 4800000, percent: 5 },
    ],
    []
  );

  const notifications = useMemo(
    () => [
      { id: 1, title: "Berkas KGB diterima", time: "2 hari lalu" },
      { id: 2, title: "SK Siap Cetak", time: "1 minggu lalu" },
    ],
    []
  );

  if (isLoading) return <div className="ud-loading">Memuat...</div>;

  function formatCurrency(v: number) {
    return v.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
  }

  const nextIncreaseDate = useMemo(() => {
    const d = new Date(profile.lastIncrease);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  }, [profile.lastIncrease]);

  const upcomingColumns = [
    {
      title: "TMT",
      dataIndex: "tmt",
      key: "tmt",
      render: (text: string) => (
        <Space>
          <CalendarOutlined className="ud-icon-primary" />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag className="ud-tag-orange">{s}</Tag> },
    {
      title: "Progres",
      key: "progress",
      render: (_: any, r: any) => (
        <div className="ud-progress-cell">
          <div className="ud-progress-row">
            <Text className="ud-note">{r.note}</Text>
            <Text className="ud-progress-value">{r.progress}%</Text>
          </div>
          <Progress percent={r.progress} size="small" showInfo={false} strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }} />
        </div>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      render: () => (
        <Space>
          <Button type="link" size="small" className="ud-link-btn">
            Detail
          </Button>
          <Button type="primary" size="small" className="ud-primary-sm">
            Ajukan
          </Button>
        </Space>
      ),
    },
  ];

  const historyColumns = [
    { title: "Tanggal", dataIndex: "date", key: "date", render: (text: string) => <Text strong>{text}</Text> },
    { title: "Sebelumnya", dataIndex: "oldSalary", key: "oldSalary", render: (v: number) => <Text type="secondary">{formatCurrency(v)}</Text> },
    { title: "Baru", dataIndex: "newSalary", key: "newSalary", render: (v: number) => <Text strong className="ud-new-salary">{formatCurrency(v)}</Text> },
    {
      title: "Kenaikan",
      dataIndex: "percent",
      key: "percent",
      render: (p: number) => (
        <Tag className="ud-tag-success">
          <RiseOutlined /> {p}%
        </Tag>
      ),
    },
  ];

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="ud-header">
        <div className="ud-header-info">
          <Title level={3} className="ud-header-title">
            Dashboard Pengguna
          </Title>
          <Text type="secondary" className="ud-header-sub">Arsip Nasional Republik Indonesia (ANRI)</Text>
        </div>

        <Space className="ud-header-actions">
          <Button icon={<RiseOutlined />} type="primary" size="large" className="ud-gradient-btn">
            Ajukan KGB
          </Button>
        </Space>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left column */}
        <Col xs={24} lg={8}>
          <Card className="profile-card" bodyStyle={{ padding: 0 }}>
            <div className="profile-body">
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div className="profile-top">
                  <Avatar size={80} icon={<UserOutlined />} className="profile-avatar" />
                  <div className="profile-meta">
                    <Text strong className="profile-name">{profile.name}</Text>
                    <div><Text className="profile-nip">NIP: {profile.nip}</Text></div>
                    <div style={{ marginTop: 8 }}>
                      <Tag className="profile-rank"><TrophyOutlined /> {profile.rank}</Tag>
                    </div>
                  </div>
                </div>

                <div className="salary-box">
                  <div className="salary-center">
                    <Text className="salary-label">Gaji Saat Ini</Text>
                    <div><Text strong className="salary-value">{formatCurrency(profile.currentSalary)}</Text></div>
                  </div>

                  <Divider className="ud-divider" />

                  <Row gutter={16}>
                    <Col span={12}>
                      <div className="stat-cell">
                        <DollarOutlined className="ud-icon-primary" />
                        <div>
                          <Text className="stat-label">Kenaikan/Tahun</Text>
                          <Text strong className="stat-value">{profile.increasePercent}%</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="stat-cell">
                        <CalendarOutlined className="ud-icon-primary" />
                        <div>
                          <Text className="stat-label">Jadwal Berikutnya</Text>
                          <Text strong className="stat-value">{new Date(nextIncreaseDate).toLocaleDateString("id-ID")}</Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* ➕ UPDATED: Tombol Edit Profil mengarah ke UserSettings */}
                <Button
                  type="default"
                  block
                  size="large"
                  className="ud-gradient-btn"
                  onClick={() => navigate("/user-settings")}
                >
                  Edit Profil
                </Button>
              </Space>
            </div>
          </Card>

          <Card title={<span><BellOutlined className="ud-icon-warning" /> <Text strong>Notifikasi</Text></span>} className="notifications-card">
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(n) => (
                <List.Item actions={[<Button type="link" size="small" className="ud-link-btn">Lihat</Button>]} className="ud-list-item">
                  <List.Item.Meta
                    avatar={
                      <Badge dot color="#fa8c16">
                        <Avatar icon={<BellOutlined />} className="ud-notif-avatar" />
                      </Badge>
                    }
                    title={<Text strong className="ud-notif-title">{n.title}</Text>}
                    description={<Text type="secondary" className="ud-notif-time">{n.time}</Text>}
                  />
                </List.Item>
              )}
            />
            <div className="ud-notif-footer">
              <Button type="link" className="ud-link-btn">Lihat Semua Notifikasi →</Button>
            </div>
          </Card>
        </Col>

        {/* Right column */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Card title={<span><ClockCircleOutlined className="ud-icon-warning" /> <Text strong>Jadwal KGB Saya</Text></span>} className="panel-card" extra={<Tag>1 Jadwal Aktif</Tag>}>
              <Table dataSource={upcoming} columns={upcomingColumns} pagination={false} size="middle" />
            </Card>

            <Card title={<span><HistoryOutlined className="ud-icon-primary" /> <Text strong>Riwayat Kenaikan Gaji</Text></span>} className="panel-card">
              <Table dataSource={history} columns={historyColumns} pagination={false} size="middle" />
            </Card>

            <Card title={<span><FileProtectOutlined className="ud-icon-success" /> <Text strong>Dokumen & SK</Text></span>} className="panel-card">
              <List
                itemLayout="horizontal"
                dataSource={[
                  { id: "d1", title: "SK Kenaikan Terakhir", status: "Tersedia", color: "#52c41a" },
                  { id: "d2", title: "Formulir Pengajuan", status: "Perlu Dilengkapi", color: "#faad14" },
                ]}
                renderItem={(item) => (
                  <List.Item actions={[<Button type="primary" className="ud-primary-sm">Unduh</Button>]} className="ud-list-item">
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileProtectOutlined />} className="ud-doc-avatar" />}
                      title={<Text strong>{item.title}</Text>}
                      description={<Tag className={item.color === "#52c41a" ? "ud-tag-success" : "ud-tag-warning"}>{item.status}</Tag>}
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

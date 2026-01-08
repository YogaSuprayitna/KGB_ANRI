import React, { useState } from "react";
import { 
  Card, Col, Row, Statistic, Table, Tag, Typography, 
  List, Avatar, Button, Progress, Space, Badge 
} from "antd";
import { 
  UserOutlined, 
  RiseOutlined, 
  HistoryOutlined, 
  FileProtectOutlined, 
  BellOutlined, 
  ClockCircleOutlined, 
  SyncOutlined,
  CheckCircleOutlined 
} from "@ant-design/icons";
import { useNavigation } from "@refinedev/core";
import DashboardFilter, { FilterValues } from "../../components/filter";
import "../../styles/AdminDashboard.css"; 

const { Title, Text } = Typography;


const mockStats = { 
  activeEmployees: 1240, 
  upcomingKGB: 45, 
  ongoingProcess: 12, 
  pendingSK: 5 
};

const upcomingKGBData = [
  { key: "1", name: "Budi Santoso", nip: "19800101...", currentRank: "III/a", tmt: "01-02-2026", progress: 75, status: "Verifikasi SDM" },
  { key: "2", name: "Siti Aminah", nip: "19850505...", currentRank: "III/c", tmt: "01-03-2026", progress: 40, status: "Menunggu Berkas" },
  { key: "3", name: "Rahmat Hidayat", nip: "19901010...", currentRank: "II/d", tmt: "01-03-2026", progress: 90, status: "Paraf Pejabat" },
];

const skNotifications = [
  { id: 1, title: "SK Siap Cetak: Ahmad Fauzi", desc: "Periode April 2026", time: "2 jam lalu" },
  { id: 2, title: "SK Siap Cetak: Dewi Lestari", desc: "Periode April 2026", time: "5 jam lalu" },
];

const historyData = [
  { key: "1", name: "Indra Wijaya", tmt: "01-01-2026", type: "KGB", skNumber: "SK/881/2026", status: "Selesai" },
  { key: "2", name: "Ratna Sari", tmt: "01-01-2026", type: "KGB", skNumber: "SK/882/2026", status: "Selesai" },
];

export const AdminDashboard: React.FC = () => {
  const { list } = useNavigation();
  
  const [filteredDataSource, setFilteredDataSource] = useState(upcomingKGBData);

  const handleSearch = (values: FilterValues) => {
    const { name, status } = values;
    const filtered = upcomingKGBData.filter((item) => {
      const matchName = name 
        ? item.name.toLowerCase().includes(name.toLowerCase()) || item.nip.includes(name)
        : true;
      const matchStatus = status ? item.status === status : true;
      return matchName && matchStatus;
    });
    setFilteredDataSource(filtered);
  };

  const processColumns = [
    {
      title: "NAMA PEGAWAI",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: "#002347" }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>NIP: {record.nip}</Text>
        </Space>
      ),
    },
    { 
      title: "TMT BARU", 
      dataIndex: "tmt", 
      key: "tmt",
      render: (text: string) => <Text style={{ fontWeight: 500 }}>{text}</Text>
    },
    {
      title: "STATUS & PROGRES",
      key: "status",
      render: (_: any, record: any) => (
        <div style={{ minWidth: 150 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: 500 }}>{record.status}</Text>
            <Text style={{ fontSize: 12 }}>{record.progress}%</Text>
          </div>
          <Progress 
            percent={record.progress} 
            size="small" 
            showInfo={false} 
            strokeColor={record.progress > 80 ? "#52c41a" : "#00509d"} 
          />
        </div>
      ),
    },
    {
      title: "AKSI",
      key: "action",
      align: 'center' as const,
      render: () => <Button type="link" size="small" style={{ fontWeight: 600 }}>Detail</Button>,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. HEADER */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <Title level={2} style={{ margin: 0, color: "#002347", fontWeight: 800 }}>Dashboard KGB</Title>
          <Text type="secondary" style={{ fontSize: 14 }}>Arsip Nasional Republik Indonesia</Text>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<RiseOutlined />} 
          className="btn-primary-solid"
        >
          Proses KGB Baru
        </Button>
      </div>

      {/* 2. STATISTIC CARDS */}
      <Row gutter={[20, 20]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" variant="borderless">
            <Statistic 
              title="Pegawai Aktif" 
              value={mockStats.activeEmployees} 
              prefix={<UserOutlined style={{ color: "#00509d", backgroundColor: "#e6f0f9", padding: 8, borderRadius: 8, marginRight: 12 }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" variant="borderless">
            <Statistic 
              title="KGB (1-3 Bulan)" 
              value={mockStats.upcomingKGB} 
              valueStyle={{ color: "#faad14" }} 
              prefix={<ClockCircleOutlined style={{ color: "#faad14", backgroundColor: "#fffbe6", padding: 8, borderRadius: 8, marginRight: 12 }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card" variant="borderless">
            <Statistic 
              title="Sedang Diproses" 
              value={mockStats.ongoingProcess} 
              prefix={<SyncOutlined spin style={{ color: "#52c41a", backgroundColor: "#f6ffed", padding: 8, borderRadius: 8, marginRight: 12 }} />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="dashboard-card priority-card" variant="borderless">
            <Statistic 
              title="SK Harus Terbit" 
              value={mockStats.pendingSK} 
              valueStyle={{ color: "#cf1322" }} 
              prefix={<FileProtectOutlined style={{ color: "#cf1322", backgroundColor: "#fff1f0", padding: 8, borderRadius: 8, marginRight: 12 }} />} 
            />
          </Card>
        </Col>
      </Row>

      {/* 3. FILTER */}
      <DashboardFilter onSearch={handleSearch} />

      {/* 4. MAIN CONTENT */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Card
              title={<Space><SyncOutlined style={{ color: "#00509d" }} /> PROSES KGB SEDANG BERJALAN</Space>}
              className="dashboard-card"
              variant="borderless"
              extra={<Button type="link" style={{ fontWeight: 600 }}>Lihat Semua</Button>}
            >
              <Table 
                dataSource={filteredDataSource} 
                columns={processColumns} 
                pagination={{ pageSize: 5 }} 
                size="middle"
                locale={{ emptyText: "Data pegawai tidak ditemukan" }}
              />
            </Card>

            <Card
              title={<Space><HistoryOutlined style={{ color: "#722ed1" }} /> RIWAYAT KGB TERAKHIR</Space>}
              className="dashboard-card"
              variant="borderless"
            >
              <Table
                dataSource={historyData}
                pagination={false}
                size="middle"
                columns={[
                  { title: "NAMA", dataIndex: "name", key: "name", render: (t) => <Text strong>{t}</Text> },
                  { title: "NO. SK", dataIndex: "skNumber", key: "skNumber", render: (text) => <Tag color="blue" style={{ borderRadius: 4, fontWeight: 600 }}>{text}</Tag> },
                  { title: "STATUS", dataIndex: "status", key: "status", render: () => <Tag color="success" icon={<CheckCircleOutlined />}>Selesai</Tag> },
                ]}
              />
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<Space><BellOutlined style={{ color: "#faad14" }} /> NOTIFIKASI SK</Space>}
            className="dashboard-card"
            variant="borderless"
          >
            <List
              itemLayout="horizontal"
              dataSource={skNotifications}
              renderItem={(item) => (
                <List.Item 
                  actions={[<Button type="primary" ghost size="small" style={{ borderRadius: 6 }}>Cetak</Button>]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot status="processing">
                        <Avatar 
                          shape="square"
                          style={{ backgroundColor: '#e6f0f9', color: '#00509d' }} 
                          icon={<FileProtectOutlined />} 
                        />
                      </Badge>
                    }
                    title={<Text strong style={{ color: '#002347' }}>{item.title}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 12 }}>{item.time} • {item.desc}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
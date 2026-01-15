import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, Table, Button, Space, Tag, Input, Select, Avatar, 
  message, Row, Col, Statistic, Typography, Modal, Form
} from "antd";
import {
  SearchOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined,
  UserOutlined, FileProtectOutlined, PlusOutlined, HomeOutlined
} from "@ant-design/icons";
import "../../styles/UsulanKGB.css";

const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = { 
  navy: "#002347", 
  blue: "#00509d", 
  success: "#52c41a", 
  warning: "#faad14", 
  error: "#ff4d4f" 
};

const STATUS_CONFIG: Record<string, any> = {
  in_progress: { color: "gold", text: "Belum diverifikasi", icon: <ClockCircleOutlined /> },
  verified: { color: "blue", text: "Diverifikasi", icon: <CheckCircleOutlined /> },
  rejected: { color: "red", text: "Ditolak", icon: <CloseCircleOutlined /> },
};

const INITIAL_DATA = [
  { key: "1", nip: "198501012010011001", name: "Dr. Ahmad Hidayat, M.Pd", position: "Arsiparis Utama", grade: "IV/d", unit: "Biro Kepegawaian dan Umum", applicationDate: "10 Jan 2026", tenure: "15 Tahun", basicSalary: 4500000, status: "in_progress" },
  { key: "2", nip: "199002152012012002", name: "Siti Nurhaliza, S.Pd", position: "Arsiparis Muda", grade: "III/d", unit: "Biro Kepegawaian dan Umum", applicationDate: "12 Jan 2026", tenure: "8 Tahun", basicSalary: 3800000, status: "verified" },
  { key: "3", nip: "198808082011011003", name: "Budi Santoso, M.Kom", position: "Pranata Komputer Madya", grade: "III/b", unit: "Biro Kepegawaian dan Umum", applicationDate: "05 Jan 2026", tenure: "12 Tahun", basicSalary: 3200000, status: "rejected" },
];

const UsulanKGB: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State utama
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Inisialisasi data dari localStorage
  const [employees, setEmployees] = useState<any[]>(() => {
    const saved = localStorage.getItem("kgb_data_anri");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("kgb_data_anri", JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  });

  // Fungsi Tambah Data Baru
  const handleAddData = (values: any) => {
    const newData = {
      ...values,
      key: Date.now().toString(), // ID unik berdasarkan timestamp
      status: "in_progress",      // Status default awal
      applicationDate: new Date().toLocaleDateString('id-ID', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      }),
      basicSalary: Number(values.basicSalary)
    };

    const updatedData = [newData, ...employees]; // Masukkan ke posisi paling atas
    localStorage.setItem("kgb_data_anri", JSON.stringify(updatedData));
    setEmployees(updatedData);
    
    message.success("Usulan pegawai baru berhasil ditambahkan!");
    setIsModalOpen(false);
    form.resetFields();
  };

  // Logika Filter & Search
  const filteredData = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch = emp.name.toLowerCase().includes(searchText.toLowerCase()) || emp.nip.includes(searchText);
      const matchStatus = filterStatus === "all" || emp.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [employees, searchText, filterStatus]);

  // Statistik
  const stats = useMemo(() => ({
    total: employees.length,
    inProgress: employees.filter(e => e.status === "in_progress").length,
    verified: employees.filter(e => e.status === "verified").length,
    rejected: employees.filter(e => e.status === "rejected").length,
  }), [employees]);

  const columns = [
    {
      title: "Pegawai",
      key: "employee",
      render: (_: any, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#e6f0f9", color: COLORS.blue }} />
          <div>
            <div style={{ fontWeight: 600, color: COLORS.navy }}>{record.name}</div>
            <div style={{ fontSize: "11px", color: "#8c8c8c" }}>NIP: {record.nip}</div>
          </div>
        </Space>
      ),
    },
    { title: "Gol.", dataIndex: "grade", width: 80 },
    { title: "Unit Kerja", dataIndex: "unit", ellipsis: true },
    { title: "Tgl Usulan", dataIndex: "applicationDate", width: 130 },
    {
      title: "Status",
      dataIndex: "status",
      width: 160,
      render: (s: string) => (
        <Tag color={STATUS_CONFIG[s]?.color} icon={STATUS_CONFIG[s]?.icon}>
          {STATUS_CONFIG[s]?.text}
        </Tag>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 100,
      render: (_: any, record: any) => (
        <Button 
          type="primary" 
          size="small" 
          style={{ backgroundColor: COLORS.blue }} 
          onClick={() => navigate(`/admin-menu-usulan/verifikasi/${record.key}`)}
        >
          Verifikasi
        </Button>
      ),
    },
  ];

  return (
    <div className="usulan-container" style={{ padding: '24px' }}>
      {/* Header & Tombol Tambah */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ color: COLORS.navy, margin: 0 }}>
            <FileProtectOutlined /> Menu Usulan KGB
          </Title>
          <Text type="secondary">Sistem Verifikasi Kenaikan Gaji Berkala ANRI</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          style={{ backgroundColor: COLORS.blue, borderRadius: '8px' }}
          onClick={() => setIsModalOpen(true)}
        >
          Tambah Usulan Baru
        </Button>
      </div>

      {/* Ringkasan Statistik */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card size="small"><Statistic title="Total Usulan" value={stats.total} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Menunggu" value={stats.inProgress} valueStyle={{ color: COLORS.warning }} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Disetujui" value={stats.verified} valueStyle={{ color: COLORS.success }} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Ditolak" value={stats.rejected} valueStyle={{ color: COLORS.error }} /></Card></Col>
      </Row>

      {/* Tabel & Filter */}
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input 
            placeholder="Cari Nama / NIP..." 
            prefix={<SearchOutlined />} 
            onChange={e => setSearchText(e.target.value)} 
            allowClear 
            style={{ width: 250 }}
          />
          <Select defaultValue="all" style={{ width: 180 }} onChange={setFilterStatus}>
            <Option value="all">Semua Status</Option>
            <Option value="in_progress">Belum diverifikasi</Option>
            <Option value="verified">Diverifikasi</Option>
            <Option value="rejected">Ditolak</Option>
          </Select>
        </Space>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="key" 
          pagination={{ pageSize: 7 }} 
        />
      </Card>

      {/* MODAL TAMBAH DATA BARU */}
      <Modal
        title="Formulir Tambah Usulan KGB"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Simpan Usulan"
        cancelText="Batal"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddData}>
          <Form.Item name="name" label="Nama Lengkap Pegawai" rules={[{ required: true, message: 'Harap isi nama!' }]}>
            <Input placeholder="Contoh: Mardiyanto" />
          </Form.Item>
          <Form.Item name="nip" label="NIP" rules={[{ required: true, len: 18, message: 'NIP harus 18 digit!' }]}>
            <Input placeholder="Contoh: 1985xxxx" maxLength={18} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="grade" label="Golongan" rules={[{ required: true }]}>
                <Select placeholder="Pilih">
                  <Option value="IV/d">IV/d</Option>
                  <Option value="IV/c">IV/c</Option>
                  <Option value="III/d">III/d</Option>
                  <Option value="III/c">III/c</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tenure" label="Masa Kerja" rules={[{ required: true }]}>
                <Input placeholder="Contoh: 10 Tahun" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="position" label="Jabatan" rules={[{ required: true }]}>
            <Input placeholder="Contoh: Pranata Komputer Madya" />
          </Form.Item>
          <Form.Item name="unit" label="Unit Kerja" rules={[{ required: true }]}>
            <Input placeholder="Contoh: Biro Kepegawaian dan Umum" />
          </Form.Item>
          <Form.Item name="basicSalary" label="Gaji Pokok Baru (Angka Saja)" rules={[{ required: true }]}>
            <Input type="number" prefix="Rp" placeholder="Contoh: 4500000" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsulanKGB;
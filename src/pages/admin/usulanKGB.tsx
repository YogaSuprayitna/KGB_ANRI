import React, { useState, useMemo, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Badge,
  Avatar,
  Tooltip,
  Upload,
  Descriptions,
  message,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  FileProtectOutlined,
  BellOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { DynamicModal } from "../../components/dynamicModal";

// ===== TYPES =====
interface Employee {
  key: string;
  nip: string;
  name: string;
  position: string;
  grade: string;
  unit: string;
  lastKGB: string;
  nextKGB: string;
  daysRemaining: number;
  status: "pending" | "validated" | "draft_created" | "notified";
  documentStatus: "complete" | "incomplete";
  photo: string | null;
}

interface StatusConfig {
  color: string;
  text: string;
  icon: React.ReactNode;
}

interface DocStatusConfig {
  color: "success" | "error";
  text: string;
}

interface Stats {
  total: number;
  pending: number;
  validated: number;
  urgent: number;
}

// ===== CONSTANTS =====
const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: { color: "gold", text: "Menunggu Validasi", icon: <ClockCircleOutlined /> },
  validated: { color: "blue", text: "Tervalidasi", icon: <CheckCircleOutlined /> },
  draft_created: { color: "purple", text: "Draft SK Dibuat", icon: <FileTextOutlined /> },
  notified: { color: "green", text: "Notifikasi Terkirim", icon: <SendOutlined /> },
};

const DOC_STATUS_CONFIG: Record<string, DocStatusConfig> = {
  complete: { color: "success", text: "Lengkap" },
  incomplete: { color: "error", text: "Tidak Lengkap" },
};

const INITIAL_EMPLOYEES: Employee[] = [
  {
    key: "1",
    nip: "198501012010011001",
    name: "Dr. Ahmad Hidayat, M.Pd",
    position: "Guru Utama",
    grade: "IV/d",
    unit: "SMA Negeri 1 Jakarta",
    lastKGB: "2023-01-15",
    nextKGB: "2025-01-15",
    daysRemaining: 34,
    status: "pending",
    documentStatus: "complete",
    photo: null,
  },
  {
    key: "2",
    nip: "199002152012012002",
    name: "Siti Nurhaliza, S.Pd",
    position: "Guru Madya",
    grade: "III/d",
    unit: "SMP Negeri 5 Jakarta",
    lastKGB: "2023-02-20",
    nextKGB: "2025-02-20",
    daysRemaining: 70,
    status: "validated",
    documentStatus: "incomplete",
    photo: null,
  },
  {
    key: "3",
    nip: "198808082011011003",
    name: "Budi Santoso, M.Kom",
    position: "Guru Muda",
    grade: "III/b",
    unit: "SMK Negeri 2 Jakarta",
    lastKGB: "2023-03-10",
    nextKGB: "2025-03-10",
    daysRemaining: 88,
    status: "draft_created",
    documentStatus: "complete",
    photo: null,
  },
  {
    key: "4",
    nip: "199505202015012004",
    name: "Dewi Lestari, S.Si",
    position: "Guru Pertama",
    grade: "III/a",
    unit: "SMA Negeri 3 Jakarta",
    lastKGB: "2023-04-05",
    nextKGB: "2025-04-05",
    daysRemaining: 114,
    status: "notified",
    documentStatus: "complete",
    photo: null,
  },
];

// ===== HELPER FUNCTIONS =====
const getStatusColor = (status: string): string => STATUS_CONFIG[status]?.color || "default";
const getStatusIcon = (status: string): React.ReactNode => STATUS_CONFIG[status]?.icon;
const getStatusText = (status: string): string => STATUS_CONFIG[status]?.text || status;

const getDocStatusColor = (status: string): "success" | "error" => 
  DOC_STATUS_CONFIG[status]?.color || "error";

const getDocStatusText = (status: string): string =>
  DOC_STATUS_CONFIG[status]?.text || status;

const calculateStats = (employees: Employee[]): Stats => ({
  total: employees.length,
  pending: employees.filter((e) => e.status === "pending").length,
  validated: employees.filter((e) => e.status === "validated").length,
  urgent: employees.filter((e) => e.daysRemaining <= 60).length,
});

// ===== COMPONENT =====
const MenuUsulanKGB: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const stats = useMemo(() => calculateStats(employees), [employees]);

  const filteredData = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.nip.includes(searchText);
      const matchStatus = filterStatus === "all" || emp.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [employees, searchText, filterStatus]);

  // ===== HANDLERS =====
  const handleViewDetail = useCallback((record: Employee): void => {
    setSelectedEmployee(record);
    setModalMode("view");
    setIsModalOpen(true);
  }, []);

  const handleValidate = useCallback((record: Employee): void => {
    setSelectedEmployee(record);
    setModalMode("edit");
    setIsModalOpen(true);
  }, []);

  const handleCreateDraft = useCallback((record: Employee): void => {
    message.loading("Membuat draft SK...", 1.5).then(() => {
      message.success(`Draft SK untuk ${record.name} berhasil dibuat!`);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.key === record.key ? { ...emp, status: "draft_created" } : emp
        )
      );
    });
  }, []);

  const handleSendNotification = useCallback((record: Employee): void => {
    message.loading("Mengirim notifikasi...", 1.5).then(() => {
      message.success(`Notifikasi berhasil dikirim ke ${record.name}!`);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.key === record.key ? { ...emp, status: "notified" } : emp
        )
      );
    });
  }, []);

  const handleModalSubmit = useCallback((): void => {
    if (!selectedEmployee) return;
    setIsLoading(true);
    setTimeout(() => {
      message.success("Validasi dokumen berhasil!");
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.key === selectedEmployee.key
            ? { ...emp, status: "validated", documentStatus: "complete" }
            : emp
        )
      );
      setIsLoading(false);
      setIsModalOpen(false);
    }, 1500);
  }, [selectedEmployee]);

  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  }, []);

  // ===== COLUMNS =====
  const columns = useMemo(
    () => [
      {
        title: "Pegawai",
        key: "employee",
        width: 280,
        render: (_: unknown, record: Employee): React.ReactNode => (
          <Space>
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>{record.name}</div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>NIP: {record.nip}</div>
            </div>
          </Space>
        ),
      },
      {
        title: "Jabatan & Unit",
        key: "position",
        render: (_: unknown, record: Employee): React.ReactNode => (
          <div>
            <div style={{ fontWeight: 500 }}>{record.position}</div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{record.unit}</div>
          </div>
        ),
      },
      {
        title: "Golongan",
        dataIndex: "grade",
        key: "grade",
        width: 100,
        render: (grade: string): React.ReactNode => <Tag color="geekblue">{grade}</Tag>,
      },
      {
        title: "Jatuh Tempo KGB",
        key: "nextKGB",
        width: 150,
        render: (_: unknown, record: Employee): React.ReactNode => (
          <div>
            <div style={{ fontSize: "13px" }}>
              <CalendarOutlined /> {record.nextKGB}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: record.daysRemaining <= 60 ? "#ff4d4f" : "#52c41a",
              }}
            >
              {record.daysRemaining} hari lagi
            </div>
          </div>
        ),
      },
      {
        title: "Dokumen",
        dataIndex: "documentStatus",
        key: "documentStatus",
        width: 130,
        render: (status: string): React.ReactNode => (
          <Badge
            status={getDocStatusColor(status)}
            text={getDocStatusText(status)}
          />
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 160,
        render: (status: string): React.ReactNode => (
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {getStatusText(status)}
          </Tag>
        ),
      },
      {
        title: "Aksi",
        key: "action",
        width: 280,
        render: (_: unknown, record: Employee): React.ReactNode => (
          <Space size="small" wrap>
            <Tooltip title="Lihat Detail">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetail(record)}
                style={{ padding: "4px 8px" }}
              >
                Detail
              </Button>
            </Tooltip>

            {record.status === "pending" && (
              <Tooltip title="Validasi Dokumen">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleValidate(record)}
                >
                  Validasi
                </Button>
              </Tooltip>
            )}

            {record.status === "validated" && (
              <Tooltip title="Buat Draft SK">
                <Button
                  type="primary"
                  size="small"
                  icon={<FileTextOutlined />}
                  onClick={() => handleCreateDraft(record)}
                  style={{ backgroundColor: "#722ed1" }}
                >
                  Draft SK
                </Button>
              </Tooltip>
            )}

            {record.status === "draft_created" && (
              <Tooltip title="Kirim Notifikasi">
                <Button
                  type="primary"
                  size="small"
                  icon={<SendOutlined />}
                  onClick={() => handleSendNotification(record)}
                  style={{ backgroundColor: "#52c41a" }}
                >
                  Notifikasi
                </Button>
              </Tooltip>
            )}
          </Space>
        ),
      },
    ],
    [handleViewDetail, handleValidate, handleCreateDraft, handleSendNotification]
  );

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0, color: "#1890ff" }}>
          <FileProtectOutlined /> Menu Usulan KGB
        </h1>
        <p style={{ color: "#8c8c8c", margin: "4px 0 0 0" }}>
          Kelola usulan kenaikan gaji berkala pegawai
        </p>
      </div>

      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: "8px" }}>
            <Statistic
              title="Total Pegawai"
              value={stats.total}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: "8px" }}>
            <Statistic
              title="Menunggu Validasi"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: "8px" }}>
            <Statistic
              title="Tervalidasi"
              value={stats.validated}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: "8px" }}>
            <Statistic
              title="Mendesak (≤60 hari)"
              value={stats.urgent}
              prefix={<BellOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        bordered={false}
        style={{ borderRadius: "8px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)", backgroundColor: "#fafafa" }}
      >
        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Cari nama atau NIP pegawai..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: "6px" }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter Status"
              style={{ width: "100%", borderRadius: "6px" }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Select.Option value="all">Semua Status</Select.Option>
              <Select.Option value="pending">Menunggu Validasi</Select.Option>
              <Select.Option value="validated">Tervalidasi</Select.Option>
              <Select.Option value="draft_created">Draft SK Dibuat</Select.Option>
              <Select.Option value="notified">Notifikasi Terkirim</Select.Option>
            </Select>
          </Col>
        </Row>

        <Table 
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} pegawai`,
          }}
          scroll={{ x: 1200 }}
          style={{ marginTop: "16px" }}
        />
      </Card>

      <DynamicModal
        title={modalMode === "view" ? "Detail Pegawai" : "Validasi Dokumen Pegawai"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={modalMode === "edit" ? handleModalSubmit : undefined}
        isLoading={isLoading}
        mode={modalMode}
        width={900}
        okText="Validasi & Setujui"
      >
        {selectedEmployee && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="NIP" span={1}>
                {selectedEmployee.nip}
              </Descriptions.Item>
              <Descriptions.Item label="Nama" span={1}>
                {selectedEmployee.name}
              </Descriptions.Item>
              <Descriptions.Item label="Jabatan" span={1}>
                {selectedEmployee.position}
              </Descriptions.Item>
              <Descriptions.Item label="Golongan" span={1}>
                <Tag color="geekblue">{selectedEmployee.grade}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Unit Kerja" span={2}>
                {selectedEmployee.unit}
              </Descriptions.Item>
              <Descriptions.Item label="KGB Terakhir" span={1}>
                {selectedEmployee.lastKGB}
              </Descriptions.Item>
              <Descriptions.Item label="KGB Berikutnya" span={1}>
                <span
                  style={{
                    color:
                      selectedEmployee.daysRemaining <= 60 ? "#ff4d4f" : "#52c41a",
                  }}
                >
                  {selectedEmployee.nextKGB} ({selectedEmployee.daysRemaining} hari lagi)
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Status Dokumen" span={1}>
                <Badge
                  status={getDocStatusColor(selectedEmployee.documentStatus)}
                  text={getDocStatusText(selectedEmployee.documentStatus)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Status Proses" span={1}>
                <Tag color={getStatusColor(selectedEmployee.status)}>
                  {getStatusText(selectedEmployee.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {modalMode === "edit" && (
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ marginBottom: "16px" }}>Checklist Dokumen</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                      SK CPNS/PNS
                    </label>
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload Dokumen</Button>
                    </Upload>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                      SK Pangkat Terakhir
                    </label>
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload Dokumen</Button>
                    </Upload>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                      SK KGB Terakhir
                    </label>
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload Dokumen</Button>
                    </Upload>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                      Catatan Validasi
                    </label>
                    <Input.TextArea rows={3} placeholder="Tambahkan catatan validasi (opsional)" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DynamicModal>
    </div>
  );
};

export default MenuUsulanKGB;
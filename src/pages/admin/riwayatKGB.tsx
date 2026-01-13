import React, { useState } from "react";
import { Table, Button, Space, Tag, Input, Select, Checkbox, Popover, DatePicker, Upload, message, Card, Typography, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined, UploadOutlined, FileTextOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

import { DynamicModal } from "../../components/DynamicModal";


interface KGBRecord {
  key: number;
  id: number;
  nama: string;
  nip: string;
  periode: number;
  gajiLama: number;
  gajiBaru: number;
  tmtKgb: string;
  nomorSk: string;
  fileSk: string;
}

interface FormDataState {
  nama: string;
  nip: string;
  periode: number | null;
  gajiLama: string | number;
  gajiBaru: string | number;
  tmtKgb: Dayjs | null;
  nomorSk: string;
  fileSk: any;
}


const generateDummyData = (): KGBRecord[] => {
  const names = ["Ahmad Rizki", "Siti Nurhaliza", "Budi Santoso", "Dewi Lestari", "Eko Prasetyo", "Fitri Handayani", "Gunawan Wijaya", "Hesti Purwaningsih", "Indra Gunawan", "Joko Widodo"];
  const data = [];
  for (let i = 1; i <= 50; i++) {
    data.push({
      key: i,
      id: i,
      nama: names[Math.floor(Math.random() * names.length)],
      nip: `19${80 + Math.floor(Math.random() * 20)}${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}${String(Math.floor(Math.random() * 1000000)).padStart(
        6,
        "0"
      )}`,
      periode: Math.floor(Math.random() * 15) + 1,
      gajiLama: 3000000 + Math.floor(Math.random() * 2000000),
      gajiBaru: 3500000 + Math.floor(Math.random() * 2500000),
      tmtKgb: dayjs()
        .subtract(Math.floor(Math.random() * 365), "day")
        .format("YYYY-MM-DD"),
      nomorSk: `SK-KGB/${2020 + Math.floor(Math.random() * 5)}/${String(Math.floor(Math.random() * 1000)).padStart(4, "0")}`,
      fileSk: "SK_KGB_Sample.pdf",
    });
  }
  return data;
};


const KGBAdminMenuRiwayat: React.FC = () => {
  const [data] = useState<KGBRecord[]>(generateDummyData());
  const [filteredData, setFilteredData] = useState<KGBRecord[]>(data);
  const [searchText, setSearchText] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [selectedRecord, setSelectedRecord] = useState<KGBRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  
  const [formData, setFormData] = useState<FormDataState>({
    nama: "",
    nip: "",
    periode: null,
    gajiLama: "",
    gajiBaru: "",
    tmtKgb: null,
    nomorSk: "",
    fileSk: null,
  });

  
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [selectedPeriodes, setSelectedPeriodes] = useState<number[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  
  const applyFilters = (search: string, periodes: number[], dates: [Dayjs | null, Dayjs | null] | null): void => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter((item) => item.nama.toLowerCase().includes(search.toLowerCase()) || item.nip.includes(search) || item.nomorSk.toLowerCase().includes(search.toLowerCase()));
    }

    if (periodes.length > 0) {
      filtered = filtered.filter((item) => periodes.includes(item.periode));
    }

    if (dates && dates[0] && dates[1]) {
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.tmtKgb);
        return itemDate.isAfter(dates[0]) && itemDate.isBefore(dates[1]);
      });
    }

    setFilteredData(filtered);
  };

  
  const handleSearch = (value: string): void => {
    setSearchText(value);
    applyFilters(value, selectedPeriodes, dateRange);
  };

  
  const handleFilterChange = (): void => {
    applyFilters(searchText, selectedPeriodes, dateRange);
    setFilterVisible(false);
  };

  const handleResetFilters = (): void => {
    setSelectedPeriodes([]);
    setDateRange(null);
    setSearchText("");
    setFilteredData(data);
    setFilterVisible(false);
  };

  
  const showModal = (mode: "view" | "edit" | "create", record: KGBRecord | null = null): void => {
    setModalMode(mode);
    setSelectedRecord(record);
    setModalVisible(true);
    if (record && mode !== "create") {
      setFormData({
        nama: record.nama,
        nip: record.nip,
        periode: record.periode,
        gajiLama: record.gajiLama,
        gajiBaru: record.gajiBaru,
        tmtKgb: dayjs(record.tmtKgb),
        nomorSk: record.nomorSk,
        fileSk: record.fileSk,
      });
    } else {
      setFormData({
        nama: "",
        nip: "",
        periode: null,
        gajiLama: "",
        gajiBaru: "",
        tmtKgb: null,
        nomorSk: "",
        fileSk: null,
      });
    }
  };

  const handleModalSubmit = (): void => {
    if (!formData.nama || !formData.nip || !formData.periode || !formData.gajiLama || !formData.gajiBaru || !formData.tmtKgb || !formData.nomorSk) {
      message.error("Mohon lengkapi semua field yang wajib diisi!");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      message.success(`Data KGB berhasil ${modalMode === "create" ? "ditambahkan" : "diperbarui"}!`);
      setIsLoading(false);
      setModalVisible(false);
      setFormData({
        nama: "",
        nip: "",
        periode: null,
        gajiLama: "",
        gajiBaru: "",
        tmtKgb: null,
        nomorSk: "",
        fileSk: null,
      });
    }, 1000);
  };

  const handleModalClose = (): void => {
    setModalVisible(false);
    setFormData({
      nama: "",
      nip: "",
      periode: null,
      gajiLama: "",
      gajiBaru: "",
      tmtKgb: null,
      nomorSk: "",
      fileSk: null,
    });
  };

  
  const columns: any[] = [
    {
      title: "No",
      key: "index",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
      
    },
    {
      title: "Nama Pegawai",
      dataIndex: "nama",
      key: "nama",
      width: 180,
      sorter: (a: KGBRecord, b: KGBRecord) => a.nama.localeCompare(b.nama),
      
    },
    {
      title: "NIP",
      dataIndex: "nip",
      key: "nip",
      width: 160,
    },
    {
      title: "Periode",
      dataIndex: "periode",
      key: "periode",
      width: 100,
      sorter: (a: KGBRecord, b: KGBRecord) => a.periode - b.periode,
      render: (periode: number) => <Tag color="blue">Periode {periode}</Tag>,
    },
    {
      title: "Gaji Lama",
      dataIndex: "gajiLama",
      key: "gajiLama",
      width: 150,
      sorter: (a: KGBRecord, b: KGBRecord) => a.gajiLama - b.gajiLama,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Gaji Baru",
      dataIndex: "gajiBaru",
      key: "gajiBaru",
      width: 150,
      sorter: (a: KGBRecord, b: KGBRecord) => a.gajiBaru - b.gajiBaru,
      render: (value: number) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: "Kenaikan",
      key: "kenaikan",
      width: 120,
      render: (_: any, record: KGBRecord) => {
        const increase = record.gajiBaru - record.gajiLama;
        return (
          <Tag color="green" style={{ fontWeight: 600 }}>
            +{formatCurrency(increase)}
          </Tag>
        );
      },
    },
    {
      title: "TMT KGB",
      dataIndex: "tmtKgb",
      key: "tmtKgb",
      width: 130,
      sorter: (a: KGBRecord, b: KGBRecord) => dayjs(a.tmtKgb).unix() - dayjs(b.tmtKgb).unix(),
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Nomor SK",
      dataIndex: "nomorSk",
      key: "nomorSk",
      width: 180,
    },
    {
      title: "Aksi",
      key: "action",
      width: 150,
      fixed: "right" as const,
      render: (_: any, record: KGBRecord) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} onClick={() => showModal("view", record)} style={{ color: "#1890ff" }}>
            Lihat
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal("edit", record)} style={{ color: "#52c41a" }}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  
  const totalRecords = filteredData.length;
  const latestKGB: KGBRecord | null = filteredData.length > 0 ? filteredData.reduce((latest, curr) => (dayjs(curr.tmtKgb).isAfter(dayjs(latest.tmtKgb)) ? curr : latest)) : null;

  
  const filterContent = (
    <div style={{ width: 320 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Periode KGB</Text>
        <div
          style={{
            marginTop: 8,
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #f0f0f0",
            borderRadius: 6,
            padding: 8,
          }}
        >
          {[...Array(15)].map((_, i) => (
            <div key={i + 1} style={{ marginBottom: 4 }}>
              <Checkbox
                checked={selectedPeriodes.includes(i + 1)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPeriodes([...selectedPeriodes, i + 1]);
                  } else {
                    setSelectedPeriodes(selectedPeriodes.filter((p) => p !== i + 1));
                  }
                }}
              >
                Periode {i + 1}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong>Rentang TMT KGB</Text>
        <RangePicker style={{ width: "100%", marginTop: 8 }} value={dateRange} onChange={(dates: any) => setDateRange(dates)} format="DD MMM YYYY" />
      </div>

      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button onClick={handleResetFilters}>Reset</Button>
        <Button type="primary" onClick={handleFilterChange}>
          Terapkan
        </Button>
      </Space>
    </div>
  );

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
          <UserOutlined /> Riwayat Kenaikan Gaji Berkala (KGB)
        </Title>
        <Text type="secondary">Kelola dan pantau riwayat KGB pegawai secara terpusat</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              backgroundColor: "#fafafa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic title="Total Riwayat KGB" value={totalRecords} prefix={<FileTextOutlined />} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 8,
              backgroundColor: "#fafafa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Statistic title="KGB Terbaru" value={latestKGB ? dayjs(latestKGB.tmtKgb).format("DD MMM YYYY") : "-"} prefix={<CalendarOutlined />} valueStyle={{ color: "#fa8c16", fontSize: 20 }} />
          </Card>
        </Col>
      </Row>

      <Card
        variant="borderless"
        style={{
          borderRadius: 8,
          backgroundColor: "#fafafa",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Space wrap>
            <Input placeholder="Cari nama, NIP, atau nomor SK..." prefix={<SearchOutlined />} value={searchText} onChange={(e) => handleSearch(e.target.value)} style={{ width: 300, borderRadius: 6 }} allowClear />
            <Popover content={filterContent} title="Filter Data KGB" trigger="click" open={filterVisible} onOpenChange={setFilterVisible} placement="bottomLeft">
              <Button icon={<FilterOutlined />} style={{ borderRadius: 6 }} type={selectedPeriodes.length > 0 || dateRange ? "primary" : "default"}>
                Filter {(selectedPeriodes.length > 0 || dateRange) && `(${selectedPeriodes.length + (dateRange ? 1 : 0)})`}
              </Button>
            </Popover>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal("create")} style={{ borderRadius: 6 }} size="large">
            Tambah Riwayat KGB
          </Button>
        </div>

        <Table
          rowKey="key"
          columns={columns}
          dataSource={filteredData}
          tableLayout="fixed"
          scroll={{ x: 1500, y: 500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} riwayat KGB`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          bordered
          size="middle"
        />
      </Card>

      <DynamicModal
        title={modalMode === "create" ? "Tambah Riwayat KGB" : modalMode === "edit" ? "Edit Riwayat KGB" : "Detail Riwayat KGB"}
        isOpen={modalVisible}
        onClose={handleModalClose}
        onSubmit={modalMode !== "view" ? handleModalSubmit : undefined}
        isLoading={isLoading}
        mode={modalMode}
        width={900}
      >
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Nama Pegawai <span style={{ color: "red" }}>*</span>
                </label>
                <Input placeholder="Masukkan nama pegawai" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} disabled={modalMode === "view"} />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  NIP <span style={{ color: "red" }}>*</span>
                </label>
                <Input placeholder="Masukkan NIP" value={formData.nip} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} disabled={modalMode === "view"} />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Periode KGB <span style={{ color: "red" }}>*</span>
                </label>
                <Select placeholder="Pilih periode" value={formData.periode} onChange={(value) => setFormData({ ...formData, periode: value })} disabled={modalMode === "view"} style={{ width: "100%" }}>
                  {[...Array(15)].map((_, i) => (
                    <Select.Option key={i + 1} value={i + 1}>
                      Periode {i + 1}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Gaji Lama <span style={{ color: "red" }}>*</span>
                </label>
                <Input type="number" placeholder="Masukkan gaji lama" prefix="Rp" value={formData.gajiLama} onChange={(e) => setFormData({ ...formData, gajiLama: e.target.value })} disabled={modalMode === "view"} />
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Gaji Baru <span style={{ color: "red" }}>*</span>
                </label>
                <Input type="number" placeholder="Masukkan gaji baru" prefix="Rp" value={formData.gajiBaru} onChange={(e) => setFormData({ ...formData, gajiBaru: e.target.value })} disabled={modalMode === "view"} />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  TMT KGB <span style={{ color: "red" }}>*</span>
                </label>
                <DatePicker style={{ width: "100%" }} format="DD MMMM YYYY" placeholder="Pilih tanggal TMT" value={formData.tmtKgb} onChange={(date) => setFormData({ ...formData, tmtKgb: date })} disabled={modalMode === "view"} />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                  Nomor SK <span style={{ color: "red" }}>*</span>
                </label>
                <Input placeholder="Masukkan nomor SK" value={formData.nomorSk} onChange={(e) => setFormData({ ...formData, nomorSk: e.target.value })} disabled={modalMode === "view"} />
              </div>
            </Col>
          </Row>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>File SK (PDF) {modalMode === "create" && <span style={{ color: "red" }}>*</span>}</label>
            <Upload
              accept=".pdf"
              maxCount={1}
              disabled={modalMode === "view"}
              beforeUpload={(file: any) => {
                setFormData({ ...formData, fileSk: file });
                return false;
              }}
            >
              <Button icon={<UploadOutlined />} disabled={modalMode === "view"}>
                Upload File SK (PDF)
              </Button>
            </Upload>
            {modalMode === "view" && selectedRecord && (
              <div style={{ marginTop: 8 }}>
                <a href="#" style={{ color: "#1890ff" }}>
                  <FileTextOutlined /> {selectedRecord?.fileSk}
                </a>
              </div>
            )}
          </div>
        </div>
      </DynamicModal>
    </div>
  );
};

export default KGBAdminMenuRiwayat;

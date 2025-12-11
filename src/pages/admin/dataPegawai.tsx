import React, { useState, useEffect } from "react";
import { 
    Table, Card, Button, Space, Typography, Tag, Avatar, Popconfirm, Form, 
    message, Input, Select, InputNumber, DatePicker, Tabs, Timeline, Row, Col 
} from "antd";
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, 
    UserOutlined, HistoryOutlined, DollarOutlined, SolutionOutlined, FilterOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DynamicModal } from "../../components/DynamicModal"; 

const { Title, Text } = Typography;
const { Option } = Select;

// ==========================================
// 1. TIPE DATA (TYPES)
// ==========================================
interface IHistory {
    date: string;
    description: string;
    skNumber: string;
}

interface IEmployee {
    id: number;
    name: string;
    nip: string;
    rank: string;
    position: string;
    unit: string;
    tenure: number;
    tmtPns: string;
    rankHistory: IHistory[];
    salaryHistory: IHistory[];
}

// ==========================================
// 2. DUMMY DATA
// ==========================================
const mockEmployees: IEmployee[] = [
    {
        id: 1,
        name: "Dr. Andi Wijaya, M.Kom",
        nip: "19850101 201001 1 001",
        rank: "IV/a",
        position: "Pranata Komputer Madya",
        unit: "Sekretariat Utama",
        tenure: 12,
        tmtPns: "2010-01-01",
        rankHistory: [
            { date: "2022-01-01", description: "Kenaikan Pangkat IV/a", skNumber: "SK/881/2022" },
            { date: "2018-01-01", description: "Kenaikan Pangkat III/d", skNumber: "SK/102/2018" }
        ],
        salaryHistory: [
            { date: "2024-01-01", description: "KGB Berkala", skNumber: "SK/Gaji/2024" }
        ]
    },
    {
        id: 2,
        name: "Siti Rahmawati, S.Sos",
        nip: "19900505 201503 2 005",
        rank: "III/c",
        position: "Arsiparis Muda",
        unit: "Deputi Konservasi",
        tenure: 8,
        tmtPns: "2015-03-01",
        rankHistory: [],
        salaryHistory: []
    },
    {
        id: 3,
        name: "Budi Santoso",
        nip: "19920202 201901 1 002",
        rank: "III/a",
        position: "Analis Kebijakan",
        unit: "Deputi IPSK",
        tenure: 3,
        tmtPns: "2019-01-01",
        rankHistory: [],
        salaryHistory: []
    },
];

// ==========================================
// 3. SUB-COMPONENT: FORM CONTENT
// ==========================================
interface EmployeeFormContentProps {
    form: any;
    mode: "create" | "edit" | "view";
    initialValues?: IEmployee;
}

const EmployeeFormContent: React.FC<EmployeeFormContentProps> = ({ form, mode, initialValues }) => {
    const isView = mode === "view";

    useEffect(() => {
        if (initialValues && mode !== "create") {
            form.setFieldsValue({
                ...initialValues,
                tmtPns: initialValues.tmtPns ? dayjs(initialValues.tmtPns) : null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, mode, form]);

    const GeneralInfo = () => (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form.Item label="Nama Lengkap" name="name" rules={[{ required: true }]}>
                    <Input disabled={isView} placeholder="Contoh: Budi Santoso" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="NIP" name="nip" rules={[{ required: true }]}>
                    <Input disabled={isView} maxLength={18} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Pangkat / Golongan" name="rank" rules={[{ required: true }]}>
                    <Select disabled={isView}>
                        {['III/a', 'III/b', 'III/c', 'III/d', 'IV/a', 'IV/b'].map(r => (
                            <Option key={r} value={r}>{r}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Jabatan" name="position" rules={[{ required: true }]}>
                    <Input disabled={isView} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Unit Kerja" name="unit" rules={[{ required: true }]}>
                    <Select disabled={isView}>
                        <Option value="Sekretariat Utama">Sekretariat Utama</Option>
                        <Option value="Deputi Konservasi">Deputi Konservasi</Option>
                        <Option value="Deputi IPSK">Deputi IPSK</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="Masa Kerja (Tahun)" name="tenure" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} disabled={isView} min={0} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label="TMT PNS" name="tmtPns" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} disabled={isView} format="DD-MM-YYYY" />
                </Form.Item>
            </Col>
        </Row>
    );

    const HistoryView = ({ data }: { data: IHistory[] }) => {
        if (!data || data.length === 0) return <Text type="secondary" italic>Belum ada data riwayat.</Text>;
        return (
            <div style={{ padding: '0 10px', marginTop: 10 }}>
                <Timeline mode="left">
                    {data.map((item, idx) => (
                        <Timeline.Item key={idx} color="blue" label={item.date}>
                            <Text strong>{item.description}</Text>
                            <br />
                            <Tag color="cyan" style={{ marginTop: 4 }}>{item.skNumber}</Tag>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        );
    };

    if (mode === "create") return <Form form={form} layout="vertical"><GeneralInfo /></Form>;

    return (
        <Form form={form} layout="vertical">
            <Tabs defaultActiveKey="1" items={[
                { key: '1', label: <span><SolutionOutlined /> Data Utama</span>, children: <GeneralInfo /> },
                { key: '2', label: <span><HistoryOutlined /> Riwayat Pangkat</span>, children: <HistoryView data={initialValues?.rankHistory || []} /> },
                { key: '3', label: <span><DollarOutlined /> Riwayat Gaji</span>, children: <HistoryView data={initialValues?.salaryHistory || []} /> }
            ]} />
        </Form>
    );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
const EmployeePage: React.FC = () => {
    const [data, setData] = useState<IEmployee[]>(mockEmployees);
    
    // -- STATE FILTER --
    const [searchText, setSearchText] = useState("");
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [selectedTenure, setSelectedTenure] = useState<string | null>(null);

    // -- STATE MODAL --
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
    const [selectedRecord, setSelectedRecord] = useState<IEmployee | undefined>(undefined);
    
    const [form] = Form.useForm();

    // --- LOGIC FILTERING GABUNGAN ---
    const filteredData = data.filter(item => {
        // 1. Filter Search (Nama & NIP)
        const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                            item.nip.includes(searchText);
        
        // 2. Filter Unit Kerja
        const matchUnit = selectedUnit ? item.unit === selectedUnit : true;

        // 3. Filter Masa Kerja
        let matchTenure = true;
        if (selectedTenure === '0-5') matchTenure = item.tenure <= 5;
        else if (selectedTenure === '5-10') matchTenure = item.tenure > 5 && item.tenure <= 10;
        else if (selectedTenure === '10+') matchTenure = item.tenure > 10;

        return matchSearch && matchUnit && matchTenure;
    });

    // --- HANDLERS ---
    const handleOpen = (mode: "create" | "edit" | "view", record?: IEmployee) => {
        setModalMode(mode);
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedRecord(undefined);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (modalMode === "create") {
                const newEmp = { ...values, id: Math.random(), rankHistory: [], salaryHistory: [] };
                setData([...data, newEmp]);
                message.success("Pegawai berhasil ditambahkan");
            } else if (modalMode === "edit" && selectedRecord) {
                const updatedData = data.map(item => item.id === selectedRecord.id ? { ...item, ...values } : item);
                setData(updatedData);
                message.success("Data berhasil diperbarui");
            }
            handleClose();
        } catch (err) { console.log("Validation Failed:", err); }
    };

    const handleDelete = (id: number) => {
        setData(data.filter(emp => emp.id !== id));
        message.success("Data pegawai dihapus");
    };

    // --- COLUMNS CONFIGURATION ---
    const columns: any = [
        {
            title: 'Pegawai',
            dataIndex: 'name',
            key: 'name',
            width: 300,
            sorter: (a: IEmployee, b: IEmployee) => a.name.localeCompare(b.name), // SORT AKTIF
            render: (text: string, record: IEmployee) => (
                <Space>
                    <Avatar shape="square" size="large" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <Space direction="vertical" size={0}>
                        <Text strong>{text}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>NIP. {record.nip}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: 'Jabatan & Gol',
            dataIndex: 'position',
            key: 'position',
            sorter: (a: IEmployee, b: IEmployee) => a.rank.localeCompare(b.rank), // SORT AKTIF
            render: (text: string, record: IEmployee) => (
                <Space direction="vertical" size={0}>
                    <Text>{text}</Text>
                    <Tag color="blue">{record.rank}</Tag>
                </Space>
            )
        },
        {
            title: 'Unit Kerja',
            dataIndex: 'unit',
            key: 'unit',
            sorter: (a: IEmployee, b: IEmployee) => a.unit.localeCompare(b.unit), // SORT AKTIF
            // Filter dihapus dari sini, dipindah ke atas
        },
        {
            title: 'Masa Kerja',
            dataIndex: 'tenure',
            key: 'tenure',
            width: 150,
            sorter: (a: IEmployee, b: IEmployee) => a.tenure - b.tenure, // SORT AKTIF
            render: (val: number) => <Tag color={val > 10 ? "green" : "orange"}>{val} Tahun</Tag>
            // Filter dihapus dari sini, dipindah ke atas
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 150,
            render: (_: any, record: IEmployee) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => handleOpen("view", record)} />
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen("edit", record)} />
                    <Popconfirm
                        title="Hapus Pegawai"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Ya" cancelText="Batal" okButtonProps={{ danger: true }}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {/* 1. Header & Title */}
                <div style={{ marginBottom: 20 }}>
                    <Title level={3} style={{ margin: 0 }}>Data Pegawai</Title>
                    <Text type="secondary">Kelola database kepegawaian ANRI</Text>
                </div>

                {/* 2. Toolbar (Search, Filters, Add Button) */}
                <div style={{ 
                    marginBottom: 24, 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 16, 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fafafa',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0'
                }}>
                    {/* Kiri: Filter Group */}
                    <Space wrap>
                        <Input 
                            placeholder="Cari Nama / NIP..." 
                            prefix={<SearchOutlined />} 
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                        />
                        
                        {/* BUTTON FILTER: UNIT KERJA */}
                        <Select
                            placeholder="Filter Unit Kerja"
                            allowClear
                            style={{ width: 200 }}
                            onChange={(val) => setSelectedUnit(val)}
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="Sekretariat Utama">Sekretariat Utama</Option>
                            <Option value="Deputi Konservasi">Deputi Konservasi</Option>
                            <Option value="Deputi IPSK">Deputi IPSK</Option>
                        </Select>

                        {/* BUTTON FILTER: MASA KERJA */}
                        <Select
                            placeholder="Filter Masa Kerja"
                            allowClear
                            style={{ width: 180 }}
                            onChange={(val) => setSelectedTenure(val)}
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="0-5">0 - 5 Tahun</Option>
                            <Option value="5-10">5 - 10 Tahun</Option>
                            <Option value="10+">&gt; 10 Tahun</Option>
                        </Select>
                    </Space>

                    {/* Kanan: Add Button */}
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large" 
                        onClick={() => handleOpen("create")}
                        style={{ borderRadius: '6px' }}
                    >
                        Tambah Pegawai
                    </Button>
                </div>

                {/* 3. Table */}
                <Table 
                    columns={columns} 
                    dataSource={filteredData} 
                    rowKey="id"
                    pagination={{ pageSize: 5, showSizeChanger: true }}
                    scroll={{ x: 800 }}
                />
            </Card>

            <DynamicModal
                title={modalMode === "create" ? "Tambah Pegawai Baru" : modalMode === "edit" ? "Edit Data Pegawai" : "Detail Pegawai"}
                isOpen={isModalOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                mode={modalMode}
                width={800}
            >
                <EmployeeFormContent form={form} mode={modalMode} initialValues={selectedRecord} />
            </DynamicModal>
        </div>
    );
};

export default EmployeePage;
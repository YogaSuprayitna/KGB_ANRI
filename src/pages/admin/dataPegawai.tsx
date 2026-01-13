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

// Warna Tema ANRI
const COLORS = {
    navy: "#002347",
    blue: "#00509d",
    lightBlue: "#e6f4ff",
    border: "#e2e8f0",
    bg: "#f8fafc"
};

// ... (Interface IHistory dan IEmployee tetap sama)
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

// ... (Dummy Data mockEmployees tetap sama)
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
                <Form.Item label={<Text strong>Nama Lengkap</Text>} name="name" rules={[{ required: true }]}>
                    <Input disabled={isView} placeholder="Contoh: Budi Santoso" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label={<Text strong>NIP</Text>} name="nip" rules={[{ required: true }]}>
                    <Input disabled={isView} maxLength={18} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label={<Text strong>Pangkat / Golongan</Text>} name="rank" rules={[{ required: true }]}>
                    <Select disabled={isView}>
                        {['III/a', 'III/b', 'III/c', 'III/d', 'IV/a', 'IV/b'].map(r => (
                            <Option key={r} value={r}>{r}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label={<Text strong>Jabatan</Text>} name="position" rules={[{ required: true }]}>
                    <Input disabled={isView} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label={<Text strong>Unit Kerja</Text>} name="unit" rules={[{ required: true }]}>
                    <Select disabled={isView}>
                        <Option value="Sekretariat Utama">Sekretariat Utama</Option>
                        <Option value="Deputi Konservasi">Deputi Konservasi</Option>
                        <Option value="Deputi IPSK">Deputi IPSK</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label={<Text strong>Masa Kerja (Tahun)</Text>} name="tenure" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} disabled={isView} min={0} />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item label={<Text strong>TMT PNS</Text>} name="tmtPns" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} disabled={isView} format="DD-MM-YYYY" />
                </Form.Item>
            </Col>
        </Row>
    );

    const HistoryView = ({ data }: { data: IHistory[] }) => {
        if (!data || data.length === 0) return <Text type="secondary" italic>Belum ada data riwayat.</Text>;
        return (
            <div style={{ padding: '20px 10px' }}>
                <Timeline mode="left">
                    {data.map((item, idx) => (
                        <Timeline.Item key={idx} color={COLORS.blue} label={<Text type="secondary">{item.date}</Text>}>
                            <Card size="small" style={{ borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
                                <Text strong style={{ color: COLORS.navy }}>{item.description}</Text>
                                <br />
                                <Tag color="blue" style={{ marginTop: 8 }}>{item.skNumber}</Tag>
                            </Card>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        );
    };

    if (mode === "create") return <Form form={form} layout="vertical"><GeneralInfo /></Form>;

    return (
        <Form form={form} layout="vertical">
            <Tabs 
                defaultActiveKey="1" 
                tabBarStyle={{ color: COLORS.navy }}
                items={[
                    { key: '1', label: <span><SolutionOutlined /> Data Utama</span>, children: <div style={{ paddingTop: 16 }}><GeneralInfo /></div> },
                    { key: '2', label: <span><HistoryOutlined /> Riwayat Pangkat</span>, children: <HistoryView data={initialValues?.rankHistory || []} /> },
                    { key: '3', label: <span><DollarOutlined /> Riwayat Gaji</span>, children: <HistoryView data={initialValues?.salaryHistory || []} /> }
                ]} 
            />
        </Form>
    );
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
const EmployeePage: React.FC = () => {
    const [data, setData] = useState<IEmployee[]>(mockEmployees);
    const [searchText, setSearchText] = useState("");
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [selectedTenure, setSelectedTenure] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
    const [selectedRecord, setSelectedRecord] = useState<IEmployee | undefined>(undefined);
    const [form] = Form.useForm();

    const filteredData = data.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || item.nip.includes(searchText);
        const matchUnit = selectedUnit ? item.unit === selectedUnit : true;
        let matchTenure = true;
        if (selectedTenure === '0-5') matchTenure = item.tenure <= 5;
        else if (selectedTenure === '5-10') matchTenure = item.tenure > 5 && item.tenure <= 10;
        else if (selectedTenure === '10+') matchTenure = item.tenure > 10;
        return matchSearch && matchUnit && matchTenure;
    });

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

    const columns: any = [
        {
            title: <Text strong style={{ color: COLORS.navy }}>Pegawai</Text>,
            dataIndex: 'name',
            key: 'name',
            width: 300,
            sorter: (a: IEmployee, b: IEmployee) => a.name.localeCompare(b.name),
            render: (text: string, record: IEmployee) => (
                <Space>
                    <Avatar shape="square" size="large" icon={<UserOutlined />} style={{ backgroundColor: COLORS.blue }} />
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ color: COLORS.navy }}>{text}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>NIP. {record.nip}</Text>
                    </Space>
                </Space>
            )
        },
        {
            title: <Text strong style={{ color: COLORS.navy }}>Jabatan & Gol</Text>,
            dataIndex: 'position',
            key: 'position',
            render: (text: string, record: IEmployee) => (
                <Space direction="vertical" size={0}>
                    <Text style={{ color: COLORS.navy }}>{text}</Text>
                    <Tag color="processing">{record.rank}</Tag>
                </Space>
            )
        },
        {
            title: <Text strong style={{ color: COLORS.navy }}>Unit Kerja</Text>,
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: <Text strong style={{ color: COLORS.navy }}>Masa Kerja</Text>,
            dataIndex: 'tenure',
            key: 'tenure',
            width: 150,
            render: (val: number) => (
                <Tag color={val > 10 ? "success" : "warning"} bordered={false}>
                    {val} Tahun
                </Tag>
            )
        },
        {
            title: <Text strong style={{ color: COLORS.navy }}>Aksi</Text>,
            key: 'action',
            width: 150,
            render: (_: any, record: IEmployee) => (
                <Space>
                    <Button size="small" type="text" style={{ color: COLORS.blue }} icon={<EyeOutlined />} onClick={() => handleOpen("view", record)} />
                    <Button size="small" type="text" style={{ color: COLORS.blue }} icon={<EditOutlined />} onClick={() => handleOpen("edit", record)} />
                    <Popconfirm
                        title="Hapus Pegawai"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Ya" cancelText="Batal" okButtonProps={{ danger: true }}
                    >
                        <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ backgroundColor: COLORS.bg }}>
            <Card 
                bordered={false} 
                style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
            >
                <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <Title level={3} style={{ margin: 0, color: COLORS.navy }}>Data Pegawai</Title>
                        <Text type="secondary">Kelola database kepegawaian Arsip Nasional Republik Indonesia</Text>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large" 
                        onClick={() => handleOpen("create")}
                        style={{ backgroundColor: COLORS.blue, borderRadius: '8px', height: '45px' }}
                    >
                        Tambah Pegawai
                    </Button>
                </div>

                {/* Filter Area - Putih & Biru Muda */}
                <div style={{ 
                    marginBottom: 24, 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 12, 
                    backgroundColor: COLORS.bg,
                    padding: '20px',
                    borderRadius: '12px',
                    border: `1px solid ${COLORS.border}`
                }}>
                    <Input 
                        placeholder="Cari Nama / NIP..." 
                        prefix={<SearchOutlined style={{ color: COLORS.blue }} />} 
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250, borderRadius: '8px' }}
                    />
                    
                    <Select
                        placeholder="Filter Unit Kerja"
                        allowClear
                        style={{ width: 200 }}
                        onChange={(val) => setSelectedUnit(val)}
                        suffixIcon={<FilterOutlined style={{ color: COLORS.blue }} />}
                    >
                        <Option value="Sekretariat Utama">Sekretariat Utama</Option>
                        <Option value="Deputi Konservasi">Deputi Konservasi</Option>
                        <Option value="Deputi IPSK">Deputi IPSK</Option>
                    </Select>

                    <Select
                        placeholder="Filter Masa Kerja"
                        allowClear
                        style={{ width: 180 }}
                        onChange={(val) => setSelectedTenure(val)}
                        suffixIcon={<FilterOutlined style={{ color: COLORS.blue }} />}
                    >
                        <Option value="0-5">0 - 5 Tahun</Option>
                        <Option value="5-10">5 - 10 Tahun</Option>
                        <Option value="10+">&gt; 10 Tahun</Option>
                    </Select>
                </div>

                <Table 
                    columns={columns} 
                    dataSource={filteredData} 
                    rowKey="id"
                    pagination={{ 
                        pageSize: 5, 
                        showSizeChanger: true,
                        position: ['bottomCenter']
                    }}
                    scroll={{ x: 800 }}
                    style={{ border: `1px solid ${COLORS.bg}`, borderRadius: '8px' }}
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
import React, { useState } from "react";
import { 
    Table, Button, Space, Tag, Input, Select, Checkbox, Popover, 
    DatePicker, Upload, message, Card, Typography, Row, Col, Statistic 
} from "antd";
import { 
    PlusOutlined, EditOutlined, EyeOutlined, FilterOutlined, 
    SearchOutlined, UploadOutlined, FileTextOutlined, 
    CalendarOutlined, UserOutlined 
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { DynamicModal } from "../../components/dynamicModal";
import "../../styles/riwayatKGB.css";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface KGBRecord {
    key: number;
    id: number;
    nama: string;
    nip: string;
    gajiLama: number;
    gajiBaru: number;
    tmtKgb: string;
    nomorSk: string;
    fileSk: string;
}

const generateDummyData = (): KGBRecord[] => {
    const names = ["Ahmad Rizki", "Siti Nurhaliza", "Budi Santoso", "Dewi Lestari", "Eko Prasetyo"];
    const data = [];
    for (let i = 1; i <= 20; i++) {
        data.push({
            key: i,
            id: i,
            nama: names[Math.floor(Math.random() * names.length)],
            nip: `19850101201001100${i}`,
            gajiLama: 3000000 + (i * 50000),
            gajiBaru: 3500000 + (i * 50000),
            tmtKgb: dayjs().subtract(i, "month").format("YYYY-MM-DD"),
            nomorSk: `SK-KGB/2025/${100 + i}`,
            fileSk: "SK_KGB_Sample.pdf",
        });
    }
    return data;
};

const riwayatKGB: React.FC = () => {
    const [data] = useState<KGBRecord[]>(generateDummyData());
    const [filteredData, setFilteredData] = useState<KGBRecord[]>(data);
    const [searchText, setSearchText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
    const [selectedRecord, setSelectedRecord] = useState<KGBRecord | null>(null);
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedPeriodes, setSelectedPeriodes] = useState<number[]>([]);
    const [dateRange, setDateRange] = useState<any>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency", currency: "IDR", minimumFractionDigits: 0,
        }).format(value);
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data.filter(item => 
            item.nama.toLowerCase().includes(value.toLowerCase()) || 
            item.nip.includes(value)
        );
        setFilteredData(filtered);
    };

    const columns = [
        { 
            title: "Pegawai", 
            key: "pegawai", 
            width: 200,
            render: (_: any, record: KGBRecord) => (
                <Space direction="vertical" size={0}>
                    <Text className="text-navy text-bold">{record.nama}</Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>NIP. {record.nip}</Text>
                </Space>
            )
        },
        { 
            title: "Gaji Baru", 
            dataIndex: "gajiBaru", 
            render: (v: number) => <Text className="text-bold" style={{ color: "#52c41a" }}>{formatCurrency(v)}</Text> 
        },
        { 
            title: "TMT KGB", 
            dataIndex: "tmtKgb", 
            render: (d: string) => dayjs(d).format("DD MMM YYYY") 
        },
        { title: "Nomor SK", dataIndex: "nomorSk" },
    ];

    return (
        <div className="history-page-container">
            <div style={{ marginBottom: 24 }}>
                <Title level={2} className="text-navy" style={{ margin: 0 }}>
                    <FileTextOutlined style={{ marginRight: 12 }} /> Riwayat KGB Pegawai
                </Title>
                <Text type="secondary">Manajemen arsip kenaikan gaji berkala Arsip Nasional Republik Indonesia</Text>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card className="stats-card">
                        <Statistic title="Total Riwayat" value={data.length} prefix={<UserOutlined style={{ color: "#00509d", backgroundColor: "#e6f0f9", padding: 8, borderRadius: 8, marginRight: 12 }} />} valueStyle={{ color: "#002347" }} />
                    </Card>
                </Col>
            </Row>

            <Card className="main-card">
                <div className="filter-wrapper">
                    <Space>
                        <Input 
                            placeholder="Cari nama atau NIP..." 
                            prefix={<SearchOutlined style={{ color: "#00509d" }} />} 
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300, borderRadius: 8 }}
                            allowClear
                        />
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    className="history-table"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1200 }}
                />
            </Card>

        </div>
    );
};

export default riwayatKGB;
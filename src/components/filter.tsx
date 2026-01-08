import React from "react";
import { Card, Form, Input, Select, Button, Row, Col, Space, Typography } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

// --- INTERFACE ---
export interface FilterValues {
  name?: string;
  status?: string;
}

interface DashboardFilterProps {
  onSearch: (values: FilterValues) => void;
}

// --- COMPONENT ---
const DashboardFilter: React.FC<DashboardFilterProps> = ({ onSearch }) => {
  const [form] = Form.useForm();

  // Warna tema Biru Solid
  const themeColors = {
    navy: "#002347",
    royalBlue: "#00509d",
    border: "#e2e8f0",
    textSub: "#64748b",
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({}); // Mengembalikan data ke kondisi awal
  };

  return (
    <Card
      variant="borderless"
      style={{
        marginBottom: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: `1px solid ${themeColors.border}`,
        padding: "4px",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSearch}
        requiredMark={false}
      >
        <Row gutter={[20, 16]} align="bottom">
          <Col xs={24} sm={12} lg={10}>
            <Form.Item
              name="name"
              label={
                <Text strong style={{ color: themeColors.navy, fontSize: "14px" }}>
                  Cari Pegawai
                </Text>
              }
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Masukkan Nama atau NIP..."
                prefix={<SearchOutlined style={{ color: themeColors.royalBlue }} />}
                allowClear
                style={{
                  height: "42px",
                  borderRadius: "8px",
                  border: `1.5px solid ${themeColors.border}`,
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              name="status"
              label={
                <Text strong style={{ color: themeColors.navy, fontSize: "14px" }}>
                  Status Proses
                </Text>
              }
              style={{ marginBottom: 0 }}
            >
              <Select
                allowClear
                placeholder="Pilih Status"
                style={{ width: "100%" }}
                // Custom style untuk internal selector ditangani Ant Design via ConfigProvider atau inline
                // Namun untuk tinggi standar, kita bisa gunakan size="large" atau kontrol pembungkus
                size="large"
                options={[
                  { value: "Verifikasi SDM", label: "Verifikasi SDM" },
                  { value: "Menunggu Berkas", label: "Menunggu Berkas" },
                  { value: "Paraf Pejabat", label: "Paraf Pejabat" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={6}>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "flex-end",
                }}
                size="middle"
              >
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  style={{
                    borderRadius: "8px",
                    height: "40px",
                    fontWeight: 600,
                    color: themeColors.textSub,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  style={{
                    borderRadius: "8px",
                    height: "40px",
                    fontWeight: 600,
                    backgroundColor: themeColors.royalBlue,
                    borderColor: themeColors.royalBlue,
                    boxShadow: "0 4px 10px rgba(0, 80, 157, 0.2)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Filter Data
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default DashboardFilter;
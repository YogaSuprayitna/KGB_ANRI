import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card, Button, Space, Tag, Input, Avatar, Descriptions, message, 
  Row, Col, Typography, Upload, Breadcrumb, Divider, Modal, Form, DatePicker
} from "antd";
import {
  ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
  UserOutlined, FileProtectOutlined, UploadOutlined, HomeOutlined, 
  PrinterOutlined, CloudUploadOutlined, EyeOutlined, FilePdfOutlined
} from "@ant-design/icons";
import "../../styles/UsulanKGBVerify.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const COLORS = { 
  navy: "#002347", 
  blue: "#00509d", 
  success: "#52c41a", 
  error: "#ff4d4f" 
};

const STATUS_LABELS: Record<string, { color: string, text: string }> = {
  in_progress: { color: "gold", text: "Belum diverifikasi" },
  verified: { color: "blue", text: "Diverifikasi" },
  rejected: { color: "red", text: "Ditolak" },
};

const UsulanKGBVerify: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [isLoading, setIsLoading] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [catatan, setCatatan] = useState("");
  
  // State untuk kontrol Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isViewFileModalOpen, setIsViewFileModalOpen] = useState(false);
  const [skData, setSkData] = useState({ noSurat: "", tanggalTerbit: "" });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("kgb_data_anri") || "[]");
    const found = savedData.find((emp: any) => emp.key === id);
    if (found) {
      setEmployee(found);
      setCatatan(found.notes || "");
    } else {
      message.error("Data pegawai tidak ditemukan!");
      navigate("/admin-menu-usulan");
    }
  }, [id, navigate]);

  const handleProcess = (newStatus: "verified" | "rejected") => {
    if (newStatus === "rejected" && !catatan.trim()) {
        message.warning("Harap masukkan catatan alasan penolakan!");
        return;
    }
    setIsLoading(true);
    const savedData = JSON.parse(localStorage.getItem("kgb_data_anri") || "[]");
    const updatedData = savedData.map((emp: any) => 
      emp.key === id ? { ...emp, status: newStatus, notes: catatan } : emp
    );
    localStorage.setItem("kgb_data_anri", JSON.stringify(updatedData));
    setTimeout(() => {
      setEmployee({ ...employee, status: newStatus, notes: catatan });
      setIsLoading(false);
      message.success(`Status diperbarui!`);
    }, 800);
  };

  const handleUploadSK = (info: any) => {
    const file = info.file.originFileObj;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = e.target.result;
      const savedData = JSON.parse(localStorage.getItem("kgb_data_anri") || "[]");
      const updatedData = savedData.map((emp: any) => 
        emp.key === id ? { ...emp, skFileName: file.name, skFileData: base64String } : emp
      );
      localStorage.setItem("kgb_data_anri", JSON.stringify(updatedData));
      setEmployee({ ...employee, skFileName: file.name, skFileData: base64String });
      message.success("SK Berhasil diunggah.");
    };
    reader.readAsDataURL(file);
  };

  const handlePrintSubmit = (values: any) => {
    setSkData({
      noSurat: values.noSurat,
      tanggalTerbit: values.tanggalTerbit.format("DD MMMM YYYY")
    });
    setIsPrintModalOpen(false); // Tutup input form
    setIsPreviewOpen(true);     // Buka pratinjau SK
  };

  if (!employee) return null;

  return (
    <div className="verify-page-container">
      <Breadcrumb style={{ marginBottom: 16 }} items={[
        { title: <HomeOutlined />, onClick: () => navigate("/admin-dashboard") },
        { title: "Daftar Usulan", onClick: () => navigate("/admin-menu-usulan") },
        { title: `Verifikasi ${employee.name}` }
      ]} />

      <div className="back-link" onClick={() => navigate("/admin-menu-usulan")}>
        <ArrowLeftOutlined /> Kembali ke Daftar Usulan
      </div>

      <Card className="verify-main-card">
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={15}>
            <div className="section-title"><UserOutlined /> Detail Informasi Pegawai</div>
            
            <Descriptions 
                bordered 
                column={1} 
                size="small" 
                labelStyle={{ width: '220px', background: '#fafafa', fontWeight: 600 }}
            >
              <Descriptions.Item label="Nama Lengkap"><Text strong>{employee.name}</Text></Descriptions.Item>
              <Descriptions.Item label="NIP">{employee.nip}</Descriptions.Item>
              <Descriptions.Item label="Golongan">{employee.grade}</Descriptions.Item>
              <Descriptions.Item label="Jabatan">{employee.position}</Descriptions.Item>
              <Descriptions.Item label="Unit Kerja">{employee.unit}</Descriptions.Item>
              <Descriptions.Item label="Masa Kerja">{employee.tenure}</Descriptions.Item>
              <Descriptions.Item label="Gaji Pokok Baru">
                <Text strong style={{ color: COLORS.blue }}>Rp{employee.basicSalary?.toLocaleString("id-ID")}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={STATUS_LABELS[employee.status]?.color}>{STATUS_LABELS[employee.status]?.text}</Tag>
              </Descriptions.Item>
              {employee.skFileName && (
                <Descriptions.Item label="Nama Berkas SK Terunggah">
                  <Space><FilePdfOutlined style={{ color: COLORS.error }} /> <Text strong>{employee.skFileName}</Text></Space>
                </Descriptions.Item>
              )}
            </Descriptions>

            {employee.status === "verified" && (
              <div style={{ marginTop: 24, padding: '20px', background: '#e6f7ff', borderRadius: '12px', border: '1px solid #91d5ff' }}>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>Aksi Dokumen Final:</Text>
                <Space wrap size="middle">
                  <Button type="primary" icon={<PrinterOutlined />} style={{ backgroundColor: COLORS.success, border: 'none' }} onClick={() => setIsPrintModalOpen(true)}>
                    Cetak Template SK
                  </Button>
                  <Upload showUploadList={false} customRequest={({ onSuccess }: any) => onSuccess("ok")} onChange={handleUploadSK} accept=".pdf">
                    <Button icon={<CloudUploadOutlined />} style={{ color: COLORS.blue, borderColor: COLORS.blue }}>
                      {employee.skFileName ? "Ganti File SK" : "Unggah SK Digital"}
                    </Button>
                  </Upload>
                  {employee.skFileData && (
                    <Button icon={<EyeOutlined />} onClick={() => setIsViewFileModalOpen(true)}>Lihat SK Terunggah</Button>
                  )}
                </Space>
              </div>
            )}
          </Col>

          <Col xs={24} lg={9}>
            <div className="verify-form-section">
              <div className="section-title"><FileProtectOutlined /> Panel Kontrol</div>
              <Text strong>Catatan Verifikasi:</Text>
              <TextArea rows={6} value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Tulis alasan..." style={{ marginTop: 8, marginBottom: 20 }} />
              <Space style={{ width: '100%' }} direction="vertical">
                <Button type="primary" block icon={<CheckCircleOutlined />} style={{ backgroundColor: COLORS.blue }} onClick={() => handleProcess("verified")} loading={isLoading}>Setujui</Button>
                <Button danger block icon={<CloseCircleOutlined />} onClick={() => handleProcess("rejected")} loading={isLoading}>Tolak</Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* MODAL INPUT NO SURAT */}
      <Modal title="Data Penerbitan SK" open={isPrintModalOpen} onCancel={() => setIsPrintModalOpen(false)} footer={null} centered>
        <Form form={form} layout="vertical" onFinish={handlePrintSubmit}>
          <Form.Item label="Nomor Surat" name="noSurat" rules={[{ required: true, message: 'Harap isi nomor surat' }]}><Input placeholder="B/KGB/001/ANRI/2026" /></Form.Item>
          <Form.Item label="Tanggal Terbit" name="tanggalTerbit" rules={[{ required: true, message: 'Harap pilih tanggal' }]}><DatePicker style={{ width: '100%' }} format="DD MMMM YYYY" /></Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: COLORS.blue }}>Buka Pratinjau SK</Button>
        </Form>
      </Modal>

      {/* MODAL PRATINJAU SK (INI YANG HILANG SEBELUMNYA) */}
      <Modal 
        title="Pratinjau Cetak SK" 
        open={isPreviewOpen} 
        onCancel={() => setIsPreviewOpen(false)} 
        width={800} 
        footer={[
          <Button key="close" onClick={() => setIsPreviewOpen(false)}>Tutup</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>Cetak</Button>
        ]}
      >
        <div id="sk-template" className="sk-paper">
          <div className="sk-header">
            <Title level={4}>ARSIP NASIONAL REPUBLIK INDONESIA</Title>
            <Divider style={{ borderTop: '2px solid #000' }} />
          </div>
          <div className="sk-body">
            <center><Text strong underline>SURAT PEMBERITAHUAN KENAIKAN GAJI BERKALA</Text><br />No: {skData.noSurat}</center>
            <p style={{ marginTop: 25 }}>Diberitahukan kepada Pegawai Negeri Sipil:</p>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr><td width="150">Nama</td><td>: <b>{employee.name}</b></td></tr>
                <tr><td>NIP</td><td>: {employee.nip}</td></tr>
                <tr><td>Gaji Pokok Baru</td><td>: Rp{employee.basicSalary?.toLocaleString("id-ID")}</td></tr>
              </tbody>
            </table>
            <p style={{ marginTop: 50, textAlign: 'right' }}>Jakarta, {skData.tanggalTerbit}<br /><br /><br /><br /><b>Kepala Biro Kepegawaian</b></p>
          </div>
        </div>
      </Modal>

      {/* MODAL LIHAT PDF */}
      <Modal title={`Berkas SK: ${employee.skFileName}`} open={isViewFileModalOpen} onCancel={() => setIsViewFileModalOpen(false)} width={1000} footer={[<Button key="x" onClick={() => setIsViewFileModalOpen(false)}>Tutup</Button>]}>
        <iframe src={employee.skFileData} width="100%" height="750px" style={{ border: 'none' }} title="PDF" />
      </Modal>
    </div>
  );
};

export default UsulanKGBVerify;
import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle, FileText } from "lucide-react";
import { Button, Form, Input, Typography, App } from "antd";
import "../styles/Login.css";

import CustomNotification from "../components/Notification"; 

const { Title, Text } = Typography;

const Login = () => {
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ⬅️ Gunakan AntD App.useApp() untuk message
  const { message } = App.useApp();

  const [notifState, setNotifState] = useState<{
    show: boolean;
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  }>({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const closeNotif = () => {
    setNotifState((prev) => ({ ...prev, show: false }));
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    closeNotif();

    try {
      const response = await login({
        username: values.username,
        password: values.password,
      });

      if (response && response.success === false) {
        const errorMsg = response.error?.message || "Login gagal";
        throw new Error(errorMsg);
      }

      // Ambil user dari localStorage
      const storedUser = localStorage.getItem("auth");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const name = parsedUser?.name || values.username;
      const role = parsedUser?.role || "user";

      // ⬅️ Ganti antMessage.success → message.success
      message.success(`Login berhasil — Selamat datang, ${name}`);

      setTimeout(() => {
        if (role === "admin") navigate("/admin-dashboard");
        else navigate("/user-dashboard");

        setLoading(false);
      }, 600);
    } catch (error) {
      setNotifState({
        show: true,
        type: "error",
        title: "Akses Ditolak",
        message: "Username atau password salah!",
      });

      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    setNotifState({
      show: true,
      type: "warning",
      title: "Perhatian",
      message: "Mohon lengkapi username dan password Anda.",
    });
  };

  return (
    <div className="login-root">
      {/* --- RENDER CUSTOM NOTIFICATION --- */}
      <CustomNotification 
        show={notifState.show}
        type={notifState.type}
        title={notifState.title}
        message={notifState.message}
        onClose={closeNotif}
      />

      <div className="split-grid">
        {/* BAGIAN KIRI: HERO / BANNER */}
        <div className="hero-section">
          <div className="decor-circle decor-1" />
          <div className="decor-circle decor-2" />
          <div className="hero-content">
            <div className="logo"><FileText size={40} color="#fff" strokeWidth={2.5} /></div>
            
            <Title className="hero-title">
              Sistem Kenaikan Gaji Berkala
            </Title>
            
            <Text className="hero-sub">
              Kelola penerbitan SK dam monitoring masa kerja, Arsip Nasional kepegawaian secara terintegrasi.
            </Text>

            <div className="features">
              {[
                "Monitoring Jatuh Tempo KGB Otomatis", 
                "Penerbitan SK Cepat & Akurat", 
                "Integrasi Data Kepegawaian"
              ].map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <div className="feature-icon"><CheckCircle size={20} color="#fff" /></div>
                  <Text className="feature-text">{feature}</Text>
                </div>
              ))}
            </div>
            <div className="sparkles"><Sparkles size={24} color="#fff" opacity={0.4} /></div>
          </div>
        </div>

        {/* BAGIAN KANAN: FORM LOGIN */}
        <div className="form-section">
          <div className="form-wrap">
            <div className="form-header">
              
              <Title level={2} className="form-title">
                Login Aplikasi KGB
              </Title>
              
              <Text type="secondary" className="form-sub">
                Masuk untuk mengelola pengajuan gaji berkala
              </Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              requiredMark={false}
              size="large"
            >
              <Form.Item 
                name="username" 
                label={<span className="label-text">Username</span>} 
                rules={[{ required: true, message: "Masukkan username!" }]}
              >
                <div className="input-wrap">
                  <div className="input-icon"><User size={20} color="#667eea" strokeWidth={2.5} /></div>
                  <Input placeholder="Masukkan Username" className="custom-input" />
                </div>
              </Form.Item>

              <Form.Item 
                name="password" 
                label={<span className="label-text">Password</span>} 
                rules={[{ required: true, message: "Masukkan password Anda!" }]}
              >
                <div className="input-wrap">
                  <div className="input-icon"><Lock size={20} color="#667eea" strokeWidth={2.5} /></div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Masukkan password" 
                    className="custom-input" 
                  />
                  <div className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={20} color="#94a3b8" /> : <EyeOff size={20} color="#94a3b8" />}
                  </div>
                </div>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} className="submit-btn">
                  <span>Masuk</span><ArrowRight size={20} />
                </Button>
              </Form.Item>
            </Form>

            <div className="form-footer">
              <Text className="footer-text">
                © {new Date().getFullYear()} Sistem Informasi Kepegawaian.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
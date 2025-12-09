import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Button, Form, Input, Typography, message as antMessage } from "antd";
import "../styles/Login.css";

// IMPORT CUSTOM NOTIFICATION
import CustomNotification from "../components/Notification"; // Sesuaikan path ini

const { Title, Text } = Typography;

const Login = () => {
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- STATE UNTUK CUSTOM NOTIFICATION ---
  const [notifState, setNotifState] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'error', // default
    title: '',
    message: '',
  });

  // Fungsi helper untuk menutup notifikasi
  const closeNotif = () => {
    setNotifState((prev) => ({ ...prev, show: false }));
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    // Tutup notifikasi lama jika ada
    closeNotif();

    try {
      const response = await login({ 
        username: values.username, 
        password: values.password 
      });

      if (response && response.success === false) {
         const errorMsg = response.error?.message || "Login gagal";
         throw new Error(errorMsg);
      }
      
      // --- SUCCESS HANDLING (TIDAK PAKAI CUSTOM NOTIF) ---
      console.log("Login sukses:", response);
      
      const storedUser = localStorage.getItem("auth");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const name = parsedUser?.name || values.username;
      const role = parsedUser?.role || "user";

      // Tetap pakai Ant Design message untuk sukses (sesuai request)
      antMessage.success(`Login berhasil — Selamat datang, ${name}`);

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
        setLoading(false);
      }, 600);

    } catch (error: any) {
      // --- ERROR HANDLING (PAKAI CUSTOM NOTIF: ERROR) ---
      console.error("Login gagal:", error);
      
      const errMsg ="Username atau password salah!";
      
      // Trigger Custom Notification Error
      setNotifState({
        show: true,
        type: 'error',
        title: 'Login Gagal',
        message: errMsg
      });
      
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.warn("Validation failed:", errorInfo);
    
    // --- VALIDATION HANDLING (PAKAI CUSTOM NOTIF: WARNING) ---
    // Trigger Custom Notification Warning (Wajib diisi)
    setNotifState({
        show: true,
        type: 'warning',
        title: 'Perhatian',
        message: 'Mohon lengkapi username dan password Anda.'
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
        <div className="hero-section">
          <div className="decor-circle decor-1" />
          <div className="decor-circle decor-2" />
          <div className="hero-content">
            <div className="logo"><Shield size={40} color="#fff" strokeWidth={2.5} /></div>
            <Title className="hero-title">Selamat Datang di Platform Kami</Title>
            <Text className="hero-sub">Kelola bisnis Anda dengan mudah dan efisien.</Text>
            <div className="features">
              {["Dashboard analitik real-time", "Keamanan data tingkat enterprise", "Support 24/7 siap membantu"].map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <div className="feature-icon"><CheckCircle size={20} color="#fff" /></div>
                  <Text className="feature-text">{feature}</Text>
                </div>
              ))}
            </div>
            <div className="sparkles"><Sparkles size={24} color="#fff" opacity={0.4} /></div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-wrap">
            <div className="form-header">
              <div className="lock-badge"><Lock size={36} color="#667eea" strokeWidth={2.5} /></div>
              <Title level={2} className="form-title">Login ke Akun</Title>
              <Text type="secondary" className="form-sub">Masukkan kredensial Anda untuk melanjutkan</Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item name="username" label={<span className="label-text">Username</span>} rules={[{ required: true, message: "Masukkan username Anda!" }]}>
                <div className="input-wrap">
                  <div className="input-icon"><User size={20} color="#667eea" strokeWidth={2.5} /></div>
                  <Input placeholder="Masukkan username" className="custom-input" />
                </div>
              </Form.Item>

              <Form.Item name="password" label={<span className="label-text">Password</span>} rules={[{ required: true, message: "Masukkan password Anda!" }]}>
                <div className="input-wrap">
                  <div className="input-icon"><Lock size={20} color="#667eea" strokeWidth={2.5} /></div>
                  <Input type={showPassword ? "text" : "password"} placeholder="Masukkan password" className="custom-input" />
                  <div className="eye-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={20} color="#94a3b8" /> : <EyeOff size={20} color="#94a3b8" />}
                  </div>
                </div>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} className="submit-btn">
                  <span>Sign In</span><ArrowRight size={20} />
                </Button>
              </Form.Item>
            </Form>

            <div className="form-footer"><Text className="footer-text">© 2024 Your Company. All rights reserved.</Text></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
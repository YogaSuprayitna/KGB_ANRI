import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, ArrowRight, CheckCircle, FileText } from "lucide-react";
import { Button, Form, Input, Typography, App } from "antd";
import "../styles/login.css";
import CustomNotification from "../components/Notification"; 

const { Title, Text } = Typography;

const Login = () => {
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const closeNotif = () => setNotifState((prev) => ({ ...prev, show: false }));

  const onFinish = async (values: any) => {
    setLoading(true);
    closeNotif(); 

    try {
      const response = await login({
        username: values.username,
        password: values.password,
      });

      if (response && response.success === false) {
        throw new Error(response.error?.message || "Username atau password salah"); 
      }

      const storedUser = localStorage.getItem("auth");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const role = parsedUser?.role || "user"; 

      message.success(`Selamat datang kembali, ${parsedUser?.name || values.username}`);

      setTimeout(() => {
        navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard", { replace: true });
        setLoading(false);
      }, 500);

    } catch (error: any) {
      setLoading(false);
      setNotifState({
        show: true,
        type: "error",
        title: "Login Gagal",
        message: error.message || "Periksa kembali kredensial Anda.",
      });
    }
  };

  return (
    <div className="login-root">
      <CustomNotification {...notifState} onClose={closeNotif} />

      <div className="split-grid">
        <div className="hero-section">
          <div className="decor-circle decor-1" />
          <div className="decor-circle decor-2" />
          
          <div className="hero-content">
            <div className="logo">
              <FileText size={38} color="#002347" strokeWidth={2.5} />
            </div>
            
            <Title className="hero-title">
              Sistem Kenaikan Gaji Berkala
            </Title>
            
            <Text className="hero-sub">
              Platform terintegrasi untuk pengelolaan SK dan monitoring masa kerja pegawai Arsip Nasional Republik Indonesia secara akurat.
            </Text>

            <div className="features">
              {["Monitoring KGB Otomatis", "Penerbitan SK Digital", "Integrasi Data Kepegawaian"].map((item, idx) => (
                <div key={idx} className="feature-item">
                  <div className="feature-icon">
                    <CheckCircle size={18} color="#ffffff" />
                  </div>
                  <Text className="feature-text">{item}</Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-wrap">
            <div className="form-header">
              <Title level={2} className="form-title">Masuk Aplikasi</Title>
              <Text type="secondary" className="form-sub">Silakan masukkan akun Anda untuk melanjutkan</Text>
            </div>

            <Form name="login" onFinish={onFinish} layout="vertical" size="large" requiredMark={false}>
              <Form.Item 
                name="username" 
                label={<span className="label-text">Username</span>}
                rules={[{ required: true, message: "Username wajib diisi" }]}
              >
                <Input 
                  placeholder="Username Anda" 
                  className="custom-input"
                  prefix={<User size={20} color="#002347" strokeWidth={2.2} style={{ marginRight: 8 }} />} 
                />
              </Form.Item>

              <Form.Item 
                name="password" 
                label={<span className="label-text">Password</span>}
                rules={[{ required: true, message: "Password wajib diisi" }]}
              >
                <Input.Password 
                  placeholder="Password Anda" 
                  className="custom-input"
                  prefix={<Lock size={20} color="#002347" strokeWidth={2.2} style={{ marginRight: 8 }} />}
                  iconRender={(visible) => (visible ? <Eye size={20} color="#94a3b8" /> : <EyeOff size={20} color="#94a3b8" />)}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 24 }}>
                <Button type="primary" htmlType="submit" block loading={loading} className="submit-btn">
                  <span>Masuk Sistem</span>
                  <ArrowRight size={20} />
                </Button>
              </Form.Item>
            </Form>

            <div className="form-footer">
              <Text className="footer-text">
                © {new Date().getFullYear()} Arsip Nasional Republik Indonesia
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
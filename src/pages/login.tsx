import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Button, Form, Input, Typography, message } from "antd";

const { Title, Text } = Typography;

const Login = () => {
  const { mutateAsync: login } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      // 1. Panggil fungsi login
      const response = await login({ 
        username: values.username, 
        password: values.password 
      });

      // --- BAGIAN INI PERBAIKAN UTAMANYA ---
      // 2. Cek apakah authProvider mengembalikan success: false
      // Jika ya, kita paksa lempar error agar masuk ke blok 'catch'
      if (response && response.success === false) {
         const errorMsg = response.error?.message || "Login gagal";
         throw new Error(errorMsg);
      }
      
      // 3. Jika success: true, baru kita jalankan logika sukses
      console.log("Login sukses:", response);
      
      // Ambil data user (sesuaikan dengan struktur data JSON server Anda)
      // authProvider Anda menyimpan user di localStorage, tapi respon login biasanya berisi data user juga jika dikonfigurasi demikian.
      // Jika response tidak membawa data user, kita bisa ambil nama dari input atau localStorage.
      
      // Mengambil nama user dari localStorage (karena authProvider Anda menyimpannya di sana)
      const storedUser = localStorage.getItem("auth");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const name = parsedUser?.name || values.username;
      const role = parsedUser?.role || "user";

      message.success(`Login berhasil — Selamat datang, ${name}`);

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
        setLoading(false);
      }, 600);

    } catch (error: any) {
      // 4. SEMUA ERROR (Baik dari server atau validasi password) AKAN DITANGKAP DI SINI
      // Halaman TIDAK akan refresh
      console.error("Login gagal:", error);
      
      const errMsg = error?.message || "Username atau password salah!";
      message.error(errMsg);
      
      // Stop loading
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.warn("Validation failed:", errorInfo);
    message.error("Periksa kembali input Anda.");
  };

  return (
    <div className="login-root">
      {/* ... (BAGIAN TAMPILAN/JSX KE BAWAH SAMA PERSIS SEPERTI SEBELUMNYA) ... */}
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
      
      {/* CSS Styles sama seperti sebelumnya */}
      <style>{`
        :root { --hero-bg-1: #667eea; --hero-bg-2: #764ba2; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow-y: auto; -webkit-font-smoothing: antialiased; }
        .login-root { min-height: 100vh; width: 100%; background: #ffffff; display: flex; align-items: stretch; }
        .split-grid { display: grid; grid-template-columns: 55% 45%; width: 100%; min-height: 100vh; }
        .hero-section { background: linear-gradient(135deg, var(--hero-bg-1) 0%, var(--hero-bg-2) 100%); padding: 80px 60px; display: flex; align-items: center; position: relative; overflow: hidden; }
        .decor-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.08); filter: blur(0.5px); }
        .decor-1 { width: 400px; height: 400px; top: -100px; left: -100px; background: rgba(255,255,255,0.1); animation: float 8s ease-in-out infinite; }
        .decor-2 { width: 300px; height: 300px; bottom: -50px; right: -50px; background: rgba(255,255,255,0.08); animation: float 10s ease-in-out infinite reverse; }
        .hero-content { position: relative; z-index: 1; max-width: 550px; color: #fff; }
        .logo { width: 80px; height: 80px; border-radius: 20px; background: rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; margin-bottom: 48px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .hero-title { color: #fff; font-size: clamp(32px, 4.5vw, 48px); font-weight: 800; margin-bottom: 16px; line-height:1.1; }
        .hero-sub { color: rgba(255,255,255,0.9); display:block; margin-bottom: 28px; font-size: clamp(16px, 2.2vw, 18px); line-height:1.6; }
        .features { display:flex; flex-direction:column; gap: 16px; margin-top: 12px; }
        .feature-item { display:flex; align-items:center; gap:16px; }
        .feature-icon { width:40px; height:40px; border-radius:10px; background: rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; }
        .feature-text { color:#fff; font-size: 16px; font-weight:500; }
        .sparkles { position:absolute; top:20%; right:10%; opacity:0.6; }
        .form-section { padding: 60px 50px; display:flex; align-items:center; justify-content:center; background: #fff; overflow-y: auto; }
        .form-wrap { max-width: 450px; width:100%; }
        .form-header { margin-bottom: 32px; }
        .lock-badge { display:inline-flex; padding:14px; border-radius:18px; background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08)); margin-bottom: 16px; }
        .form-title { margin: 0 0 8px 0; font-size: clamp(22px, 3.2vw, 28px); font-weight:700; color:#1e293b; }
        .form-sub { color:#64748b; display:block; margin-bottom: 0; }
        .label-text { font-weight:600; color:#1e293b; font-size:15px; }
        .input-wrap { position: relative; }
        .input-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); z-index:1; }
        .custom-input { border-radius:14px; padding: 14px 20px 14px 48px; height:56px; font-size:16px; border: 2px solid #e2e8f0; }
        .eye-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); cursor:pointer; z-index:1; color:#94a3b8; }
        .submit-btn { height:58px; background: linear-gradient(135deg, var(--hero-bg-1), var(--hero-bg-2)); border:none; border-radius:14px; font-size:17px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow: 0 10px 30px rgba(102,126,234,0.25); }
        .form-footer { margin-top: 28px; text-align:center; }
        .footer-text { color:#94a3b8; font-size:13px; }
        .custom-input:focus, .custom-input.ant-input:focus { border-color: var(--hero-bg-1); box-shadow: 0 0 0 6px rgba(102,126,234,0.08); outline: none; }
        @media (max-width: 1200px) { .hero-section { padding: 60px 40px; } .form-section { padding: 50px 40px; } }
        @media (max-width: 1024px) { .split-grid { grid-template-columns: 1fr !important; } .hero-section { display: none !important; } .form-section { padding: 40px 32px; } }
        @media (max-width: 768px) { .form-section { padding: 32px 24px; } .hero-title { font-size: clamp(24px, 6vw, 32px); } .custom-input { height:54px; } .submit-btn { height:54px; font-size:16px; } }
        @media (max-width: 576px) { .form-wrap { padding: 8px; } .custom-input { font-size:15px; height:50px; padding-left:44px; } .submit-btn { height:50px; font-size:15px; } }
      `}</style>
    </div>
  );
};

export default Login;
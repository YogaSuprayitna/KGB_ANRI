import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Form, Input, Card, Typography, Row, Col, message } from "antd";

const { Title, Text, Link } = Typography;

const Login = () => {
  const { mutate: login } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);

    login(
      { username: values.username, password: values.password },
      {
        onSuccess: (data: any) => {
          console.log("login response:", data); // debug
          const role = data?.role ?? data?.user?.role; // menampung berbagai struktur
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/user-dashboard");
          }
          setLoading(false);
        },
        onError: () => {
          message.error("Username atau password salah!");
          setLoading(false);
        },
      }
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "-100px",
          left: "-100px",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          bottom: "-50px",
          right: "-50px",
          animation: "float 8s ease-in-out infinite",
        }}
      />

      <Row justify="center" style={{ width: "100%", zIndex: 1 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8} xxl={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: "24px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.98)",
            }}
          >
            {/* Header with Logo */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              >
                <LockOutlined style={{ fontSize: "40px", color: "#fff" }} />
              </div>
              <Title level={2} style={{ margin: "0 0 8px 0", fontSize: "clamp(24px, 5vw, 32px)" }}>
                Welcome Back
              </Title>
              <Text type="secondary" style={{ fontSize: "clamp(14px, 3vw, 16px)" }}>
                Login to access your dashboard
              </Text>
            </div>

            {/* Form */}
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
              layout="vertical"
            >
              <Form.Item
                name="username"
                label={<span style={{ fontWeight: "600" }}>Username</span>}
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#667eea" }} />}
                  placeholder="Enter your username"
                  style={{
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "16px",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={{ fontWeight: "600" }}>Password</span>}
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#667eea" }} />}
                  placeholder="Enter your password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  style={{
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "16px",
                  }}
                />
              </Form.Item>



              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    height: "52px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "600",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
              © 2024 Your Company. All rights reserved.
            </Text>
          </div>
        </Col>
      </Row>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 576px) {
          .ant-form-item-label {
            padding-bottom: 4px !important;
          }
          
          .ant-input-affix-wrapper,
          .ant-input {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
        }

        /* Smooth transitions */
        .ant-input:focus,
        .ant-input-affix-wrapper:focus,
        .ant-input-affix-wrapper-focused {
          border-color: #667eea !important;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
        }

        /* Hover effects for links */
        a:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
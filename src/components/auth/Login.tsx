// src/components/auth/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "./AuthContext";
import bcrypt from "bcryptjs";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data: users } = await axios.get("http://localhost:3000/users");
      const user = users.find((u: any) => u.email === values.email);

      if (!user) {
        message.error("Email không tồn tại!");
        setLoading(false);
        return;
      }

      const isMatch = await bcrypt.compare(values.password, user.password);
      if (!isMatch) {
        message.error("Mật khẩu không đúng!");
        setLoading(false);
        return;
      }

      if (user.isLocked && user.lockUntil) {
        const lockDate = new Date(user.lockUntil);
        const now = new Date();
        if (lockDate > now) {
          message.error(
            `Tài khoản của bạn bị khóa đến ${lockDate.toLocaleDateString("vi-VN")}`
          );
          setLoading(false);
          return;
        }
      }

      login(user);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      message.success("Đăng nhập thành công!");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      message.error("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #4a2c00 100%)", // Gradient đen - vàng đậm
      }}
    >
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          background: "#fffef7", // Màu trắng ngà nhẹ nhàng
          padding: "20px",
        }}
        cover={
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              background: "rgba(255, 215, 0, 0.1)", // Vàng nhạt trong suốt
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Title
              level={2}
              style={{
                color: "#d4af37", // Vàng ánh kim
                margin: 0,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Đăng Nhập
            </Title>
            <Text style={{ color: "#4a4a4a" }}>
              Chào mừng bạn quay lại!
            </Text>
          </div>
        }
      >
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ padding: "0 10px" }}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#d4af37" }} />}
              placeholder="Email"
              size="large"
              style={{
                borderRadius: 8,
                padding: "10px",
                borderColor: "#d4af37",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#d4af37" }} />}
              placeholder="Mật khẩu"
              size="large"
              style={{
                borderRadius: 8,
                padding: "10px",
                borderColor: "#d4af37",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              size="large"
              style={{
                borderRadius: 8,
                height: 48,
                background: "#d4af37", // Màu vàng kim loại
                border: "none",
                fontWeight: 600,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e6c34c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#d4af37")
              }
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Link to="/register">
              <Text
                style={{
                  color: "#d4af37",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                Chưa có tài khoản? Đăng ký ngay
              </Text>
            </Link>
            <a href="#">
              <Text style={{ color: "#4a4a4a" }}>Quên mật khẩu?</Text>
            </a>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
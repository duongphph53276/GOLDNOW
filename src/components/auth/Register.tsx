// src/components/auth/Register.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Thêm Link cho liên kết
import axios from "axios";
import { Form, Input, Button, Card, Typography, message, Space } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons"; // Thêm icons
import { useAuth } from "./AuthContext";

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  // Kiểm tra nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const onFinish = async (values: {
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const registerData = { ...values, role: "client" };
      const { data } = await axios.post(
        "http://localhost:3000/register",
        registerData
      );
      login(data);
      navigate("/");
      message.success("Đăng ký thành công!");
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      message.error("Đăng ký thất bại! Email có thể đã tồn tại.");
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
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Gradient nền
      }}
    >
      <Card
        style={{
          width: 450, // Tăng width để chứa thêm input
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)", // Đổ bóng đẹp
          background: "#fff",
          padding: "20px",
        }}
        cover={
          <div
            style={{
              textAlign: "center",
              padding: "20px 0",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <Title
              level={2}
              style={{
                color: "#1890ff",
                margin: 0,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Đăng Ký
            </Title>
            <Text style={{ color: "#666" }}>
              Tạo tài khoản mới để bắt đầu!
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
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên tài khoản!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              placeholder="Tên tài khoản"
              size="large"
              style={{
                borderRadius: 8,
                padding: "10px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#1890ff" }} />}
              placeholder="Email"
              size="large"
              style={{
                borderRadius: 8,
                padding: "10px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "SĐT phải là số và có 10-11 chữ số",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "#1890ff" }} />}
              placeholder="Số điện thoại"
              size="large"
              style={{
                borderRadius: 8,
                padding: "10px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              placeholder="Mật khẩu"
              size="large"
              style={{
                borderRadius: 8,
                padding: "10px",
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
                background: "#1890ff",
                border: "none",
                fontWeight: 600,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#40a9ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1890ff")
              }
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Link to="/login">
              <Text
                style={{
                  color: "#1890ff",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                Đã có tài khoản? Đăng nhập ngay
              </Text>
            </Link>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
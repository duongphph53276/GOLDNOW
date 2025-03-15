import { useState } from "react";
import { Layout, Input, Button, Row, Col, Typography, Avatar, Dropdown, Menu, AutoComplete } from "antd";
import { UserOutlined, SearchOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";
import axios from "axios";

const { Header } = Layout;
const { Text } = Typography;

const HeaderClient = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  // Danh sách sản phẩm mẫu (có thể thay bằng API call)
  const fetchProducts = async (query: string) => {
    try {
      // Giả sử API trả về danh sách sản phẩm từ endpoint "/products"
      const { data } = await axios.get("http://localhost:3000/products");
      const filteredProducts = data
        .filter((product: any) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
        .map((product: any) => ({
          value: product.id.toString(),
          label: `${product.name} - ${product.price.toLocaleString("vi-VN")} VNĐ`,
        }));
      setOptions(filteredProducts);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    }
  };

  // Xử lý khi người dùng thay đổi giá trị tìm kiếm
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (value) {
      fetchProducts(value);
    } else {
      setOptions([]);
    }
  };

  // Xử lý khi chọn một sản phẩm từ kết quả tìm kiếm
  const handleSelect = (value: string) => {
    navigate(`/product/${value}`); // Chuyển hướng đến trang chi tiết sản phẩm
    setSearchValue("");
    setOptions([]);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={logout} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: "#222", padding: "0 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <Row justify="space-between" align="middle">
        {/* Logo */}
        <Col>
          <Link to="/">
            <Text strong style={{ fontSize: "20px", color: "#D4AF37" }}>GOLD WORLD</Text>
          </Link>
        </Col>

        {/* Thanh tìm kiếm */}
        <Col flex="auto" style={{ margin: "0 20px" }}>
          <AutoComplete
            value={searchValue}
            options={options}
            style={{ width: "100%", maxWidth: 500, }}
            onSearch={handleSearchChange}
            onSelect={handleSelect}
          >
            <Input
              prefix={<SearchOutlined style={{color: "#D4AF37" }} />}
              style={{ borderRadius: "6px" }}
              size="large"
            />
          </AutoComplete>
        </Col>

        {/* Nếu đã đăng nhập */}
        {user ? (
          <Col>
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Button type="text" style={{ color: "#D4AF37" }}>
                <Avatar size="large" icon={<UserOutlined />} />
                <Text style={{ marginLeft: 8, color: "#D4AF37" }}>{user.username}</Text>
              </Button>
            </Dropdown>
          </Col>
        ) : (
          // Nếu chưa đăng nhập
          <Col>
            <Link to="/login">
              <Button icon={<LoginOutlined />} type="text" style={{ marginRight: 10, color: "#D4AF37" }}>
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button
                icon={<UserAddOutlined />}
                style={{ background: "#D4AF37", color: "#222", fontWeight: "bold" }}
              >
                Đăng ký
              </Button>
            </Link>
          </Col>
        )}
      </Row>
    </Header>
  );
};

export default HeaderClient;
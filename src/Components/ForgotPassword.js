import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container } from "react-bootstrap";
import { Button, notification, Spin } from "antd";
import Header from "../Common/Header";
import Footer from "../Common/Footer";

import http from "../HTTP/http";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Show notification about waiting
    openNotification('info', 'Vui lòng đợi', `Chúng tôi đang gửi đường link đặt lại mật khẩu qua email của bạn: ${email}`);

    try {
      const response = await http.post("/api/forgot-password", { email, username });
      if (response.status === 200) {
        openNotification('success', 'Thành công', 'Đã gửi email xác nhận! Vui lòng kiểm tra hộp thư của bạn.');
         // Pass username via state
      } else {
        openNotification('error', 'Lỗi', response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      openNotification('error', 'Lỗi', errorMsg);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <Container className="login-container mt-5">
        <h2 className="text-center">Quên Mật Khẩu</h2>
        <Spin spinning={loading}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-100" 
              loading={loading}
              disabled={loading}
              style={{ backgroundColor: "black" }}
            >
              Gửi Email
            </Button>
          </Form>
        </Spin>
      </Container>
      <Footer />
    </>
  );
};

export default ForgotPassword;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, InputGroup } from "react-bootstrap";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../CSS/login.css"; // Nếu có CSS riêng cho Login, bạn vẫn có thể giữ

import { useDispatch } from "react-redux";
import { loginUser } from "../redux/apiRequest";
import { notification } from "antd"; // Import Ant Design notification component

const Login = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer = {
      userName: userName,
      passWord: passWord,
    };
    const result = await loginUser(customer, dispatch, navigate);
    
    if (result.status === "success") {
      notification.success({
        message: "Đăng nhập thành công",
        description: "Bạn đã đăng nhập thành công!",
        duration: 1.5,
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      notification.error({
        message: "Lỗi đăng nhập",
        description: "Sai tên đăng nhập hoặc mật khẩu.",
        duration: 1.5,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordNavigation = () => {
    navigate("/forgot-password"); // Điều hướng đến trang quên mật khẩu
  };

  const handleRegisterNavigation = () => {
    navigate("/register"); // Điều hướng đến trang đăng ký
  };

  return (
    <>
      <Header />
      <Container className="login-container mt-5">
        <h2 className="text-center">ĐĂNG NHẬP</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Control
              type="text"
              placeholder="Tên đăng nhập"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="passWord">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderLeft: "none",
                  padding: "8px",
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  backgroundColor: "#fff",
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </InputGroup>
            <div className="text-muted mt-2">
              <a onClick={handleForgotPasswordNavigation} style={{ cursor: "pointer", color: "blue" }}>
                Quên mật khẩu
              </a>
              <br />
              <a>Khách hàng mới? </a>
              <a onClick={handleRegisterNavigation} style={{ cursor: "pointer", color: "blue" }}>
                Tạo tài khoản
              </a>
            </div>
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100">
            Đăng nhập
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Login;

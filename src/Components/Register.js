import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerCus } from "../redux/apiRequest";
import { notification } from "antd"; // Import Ant Design notification component

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerError = useSelector((state) => state.auth.error); // Get error from Redux store

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Validate password complexity
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordPattern.test(password)) {
      setValidationError(
        "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số, từ 6 ký tự trở lên"
      );
      return;
    }

    // Validate phone number is numeric
    if (!/^\d+$/.test(phoneNumber)) {
      setValidationError("Số điện thoại chỉ được chứa các ký tự số");
      return;
    }

    // Clear any previous validation errors
    setValidationError("");

    const newCustomer = {
      userName: username,
      passWord: password,
      hoTen: fullName,
      SDT: phoneNumber,
      email: email,
    };

    // Call registerCus function
    const result = await registerCus(newCustomer, dispatch, navigate);

    if (result.success) {
      // Reset form fields after submission (optional)
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setPhoneNumber("");
      setEmail("");

      // Show success message
      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký thành công! Đăng nhập để tiếp tục.",
        duration: 1.5,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500); // Delay navigation to match notification duration
    } else {
      // Show error message
      notification.error({
        message: "Đăng ký thất bại",
        description: result.message || "Có lỗi xảy ra trong quá trình đăng ký.",
        duration: 1.5,
      });
    }
  };

  return (
    <>
      <Header />
      <Container className="login-container mt-5">
        <h2 className="text-center">ĐĂNG KÝ</h2>

        {validationError && (
          <notification.error
            message="Lỗi"
            description={validationError}
            duration={1.5}
          />
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Control
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Control
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Control
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fullName">
            <Form.Control
              type="text"
              placeholder="Họ tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phoneNumber">
            <Form.Control
              type="text"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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

          <Button variant="dark" type="submit" className="w-100">
            Đăng ký
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Register;

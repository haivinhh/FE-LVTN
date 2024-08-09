import React, { useState, useEffect } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";
import http from "../HTTP/http";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateCart } from "../redux/apiRequest";
import { createAxios } from "../redux/createInstance";
import { loginSuccess } from "../redux/authSlice";
import { notification } from "antd"; // Import Ant Design notification component
import { useNavigate } from "react-router-dom";


const DetailProduct = () => {
  const { idSanPham } = useParams();
  const [product, setProduct] = useState({});
  const [count, setCount] = useState(1);
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await http.get(`/api/sanpham/detail/${idSanPham}`);
        setProduct(response.data);
      } catch (error) {
        console.error("There was an error fetching the product!", error);
      }
    };

    loadProduct();
  }, [idSanPham]);

  const formatPrice = (price) => {
    if (price) {
      return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
      return ''; // or any default value you prefer
    }
  };

  const decreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const increaseCount = () => {
    setCount(count + 1);
  };

  const changeCount = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setCount(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      const axiosJWT = createAxios(customer, dispatch, loginSuccess);
      const result = await createOrUpdateCart(idSanPham, count, customer.accessToken, axiosJWT);

      if (result.success) {
        notification.success({
          message: 'Thành công',
          description: 'Sản phẩm đã được thêm vào giỏ hàng thành công!',
        });
        navigate("/sanpham")
      } else {
        notification.error({
          message: 'Lỗi',
          description: `Không thể thêm vào giỏ hàng: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.',
      });
    }
  };

  return (
    <>
      <Header />
      <Container
        style={{
          marginTop: "200px",
          marginBottom: "100px",
          borderRadius: "25px",
          border: "2px solid #cccccc",
          padding: "20px",
          boxShadow: "5px 10px #888888",
        }}
      >
        <h1 style={{ marginLeft: "250px" }}>CHI TIẾT SẢN PHẨM</h1>
        <Row>
          <Col md={3}>
            <Card.Img
              style={{ borderRadius: "10% 10% 10% 10% / 11% 10% 10% 10% ", marginLeft: "50px" }}
              variant="top"
              src={product.hinhSP}
            />
          </Col>
          <Col md={9} style={{ width: "50rem", margin: "50px" }}>
            <Card.Title>{product.tenSanPham}</Card.Title>
            <Card.Text>{product.moTa}</Card.Text>
            <ListGroup variant="flush">
              <Card.Text>
                <b style={{ color: "red" }}>{formatPrice(product.donGia)}</b>
              </Card.Text>
              <Row
                xs="auto"
                style={{
                  marginLeft: "300px",
                  width: "50%",
                  borderRadius: "0px",
                }}
              >
                <Row>
                  <InputGroup className="mb-3">
                    <Col md={3} style={{ marginLeft: "10px" }}>
                      <Button
                        onClick={decreaseCount}
                        variant="outline-dark"
                        style={{ width: "37px" }}
                      >
                        -
                      </Button>
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        style={{
                          width: "45px",
                          textAlign: "center",
                          marginLeft: "3px",
                        }}
                        value={count}
                        aria-describedby="basic-addon1"
                        onChange={changeCount}
                      />
                    </Col>
                    <Col md={3} style={{ marginLeft: "13px" }}>
                      <Button onClick={increaseCount} variant="outline-dark">
                        +
                      </Button>
                    </Col>
                  </InputGroup>
                </Row>
              </Row>
              <ListGroup.Item>
                <Col md="auto" style={{ marginRight: "10px" }}>
                  <Button
                    variant="dark"
                    style={{ height: "51px" }}
                    onClick={handleAddToCart}
                  >
                    <b>Thêm vào giỏ hàng</b>
                  </Button>
                </Col>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default DetailProduct;

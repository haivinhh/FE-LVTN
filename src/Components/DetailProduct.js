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
    return price
      ? price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : "";
  };

  const decreaseCount = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
  };

  const increaseCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const changeCount = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setCount(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      const axiosJWT = createAxios(customer, dispatch, loginSuccess);
      const result = await createOrUpdateCart(
        idSanPham,
        count,
        customer.accessToken,
        axiosJWT
      );

      if (result.success) {
        notification.success({
          message: "Thành công",
          description: "Sản phẩm đã được thêm vào giỏ hàng thành công!",
        });
        navigate("/sanpham");
      } else {
        notification.error({
          message: "Lỗi",
          description: `Không thể thêm vào giỏ hàng: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm vào giỏ hàng. Vui lòng đăng nhập",
      });
    }
  };

  return (
    <>
      <Header />
      <Container
        className="py-4 my-4 shadow rounded border"
        style={{ maxWidth: "1200px" }}
      >
        <h1 className="text-center mb-4" style={{ marginLeft: "400px" }}>
          Chi Tiết Sản Phẩm
        </h1>
        <Row>
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            <Card.Img
              className="img-fluid rounded"
              src={product.hinhSP}
              alt={product.tenSanPham}
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </Col>
          <Col md={8}>
            <Card.Title className="mb-3">{product.tenSanPham}</Card.Title>
            <Card.Text className="mb-3"style={{textAlign:"left"}}><span style={{fontWeight:"bold"}}>Mô Tả: </span>{product.thongTinSP}</Card.Text>
            <ListGroup variant="flush">
              <h4 className="text-danger">{formatPrice(product.donGia)}</h4>

              <Row
                className="align-items-center"
                style={{ marginLeft: "280px" }}
              >
                <Col xs="auto">
                  <Button
                    onClick={decreaseCount}
                    variant="dark"
                    style={{ width: "40px" }}
                  >
                    -
                  </Button>
                </Col>
                <Col xs="auto">
                  <Form.Control
                    style={{ width: "60px", textAlign: "center" }}
                    value={count}
                    onChange={changeCount}
                    min={1}
                    type="number"
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    onClick={increaseCount}
                    variant="dark"
                    style={{ width: "40px" }}
                  >
                    +
                  </Button>
                </Col>
              </Row>

              <ListGroup.Item className="text-center">
                <Button variant="dark" onClick={handleAddToCart}>
                  <b>Thêm vào giỏ hàng</b>
                </Button>
              </ListGroup.Item>
            </ListGroup>
            <ListGroup.Item className="text-left mt-3" style={{textAlign: "left"}}>
                <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                  <li>Đăng ký tài khoản để mua hàng nhận được nhiều ưu đãi hấp dẫn.</li>
                  <li>Khi mua từ 5 sản phẩm trở lên bạn sẽ được giảm 10% giá trị đơn hàng.</li>
                  <li>Khi tài khoản của bạn đã mua từ 10 sản phẩm trở lên sẽ được giảm 20% giá trị đơn hàng.(chỉ khi đơn hàng của bạn được 
                    xác nhận giao thành công thì mới được tính)</li>
                  <li>Nếu có cả 2 điều kiện trên thì bạn sẽ được giảm 30% giá trị đơn hàng.</li>
                </ul>
              </ListGroup.Item>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default DetailProduct;

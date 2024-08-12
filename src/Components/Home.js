import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import http from "../HTTP/http";
import banner1 from "../Icon/banner1.png";
import banner2 from "../Icon/banner2.png";
import "../CSS/home.css"; // Import the custom CSS file

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = "MCase";
    loadProducts();
  }, []);

  const loadProducts = () => {
    http
      .get(`/api/sanpham`)
      .then((response) => {
        console.log(response);
        // Filter products with odd idSanPham
        const filteredProducts = response.data.filter(
          (product) => product.idSanPham % 2 !== 0
        );
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      <Header />
      <Carousel fade>
        <Carousel.Item>
          <img className="d-block w-100" src={banner1} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={banner2} alt="Second slide" />
        </Carousel.Item>
      </Carousel>
      <div style={{ margin: "70px" }}></div>
      <Container>
        <Row>
          <p style={{ fontSize: "3rem" }}>
            <b>SẢN PHẨM NỔI BẬT</b>
          </p>
        </Row>
        <Row style={{ marginLeft: "50px" }}>
          {products.map((product) => (
            <Col sm={4} key={product.idSanPham} className="d-flex">
              <Card
                style={{ width: "18rem", marginTop: "50px" }}
                className="flex-fill"
              >
                <Link
                  to={`/sanpham/detail/${product.idSanPham}`}
                  className="text-dark no-underline"
                >
                  {" "}
                
                  <Card.Img
                    variant="top"
                    src={product.hinhSP}
                    className="product-image mb-3"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title style={{ textDecoration: "none" }}>
                      {product.tenSanPham}
                    </Card.Title>
                    <Card.Text style={{ color: "red", textDecoration: "none" }}>
                      {formatPrice(product.donGia)}
                    </Card.Text>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <div style={{ margin: "150px" }}></div>
      <Footer />
    </>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { Button, Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import logo from "../Icon/logo.jpg";
import http from "../HTTP/http";
import '../CSS/header.css';
import { logOutCus } from "../redux/apiRequest";
import { createAxios } from "../redux/createInstance";
import { logOutSuccess } from "../redux/authSlice";
import { getCartLogout } from "../redux/cartSlice";

const Header = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = customer?.accessToken;
  const idUser = customer?.idUser;
  
  // Create axios instance
  let axiosJWT = createAxios(customer, dispatch, logOutSuccess, getCartLogout);

  const handleLogoutClick = async () => {
    try {
      await logOutCus(dispatch, navigate, accessToken, axiosJWT);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await http.get("/api/danhmucsp");
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (idDanhMuc) => {
    localStorage.setItem('selectedCategoryId', idDanhMuc);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCartClick = () => {
    navigate('/cart'); // Navigate to cart page
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      localStorage.removeItem('selectedCategoryId'); // Clear selectedCategoryId on search
      localStorage.setItem('searchTerm', searchTerm);
      navigate(`/sanpham/search=${encodeURIComponent(searchTerm)}`); // Navigate to search results
    }
  };

  const handleSanPhamClick = () => {
    localStorage.removeItem('selectedCategoryId');
    localStorage.removeItem('searchTerm');
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  const handleProfileClick = () => {
    navigate('/profilecustomer');
  };

  const userDropdown = (
    <NavDropdown
      title={<Button variant="dark" style={{ marginLeft: '10px' }}><UserOutlined style={{ fontSize: '24px', color: 'white' }} /></Button>}
      id="basic-nav-dropdown"
      align="end"
    >
      <NavDropdown.Item onClick={handleLogoutClick}>Đăng xuất</NavDropdown.Item>
      <NavDropdown.Item onClick={handleProfileClick}>Thông tin cá nhân và <br/>quản lý đơn hàng</NavDropdown.Item>
    </NavDropdown>
  );

  return (
    <>
      <Navbar expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" style={{ cursor: 'pointer' }}>
            <img
              src={logo}
              style={{ boxShadow: "5px 10px #C0C0C0", margin: "10px", height: "50px" }}
              alt="Logo thương hiệu"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
              <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
              <NavDropdown title="Danh mục sản phẩm" id="navbarScrollingDropdown">
                {categories.map((value) => (
                  <NavDropdown.Item
                    key={value.idDanhMuc}
                    as={Link}
                    to={`/sanpham/danhmuc/${value.idDanhMuc}`}
                    onClick={() => handleCategoryClick(value.idDanhMuc)}
                    className="text-black"
                    style={{ textDecoration: "none" }}
                  >
                    {value.tenDanhMuc}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link as={Link} to="/sanpham" onClick={handleSanPhamClick}>
                Sản Phẩm
              </Nav.Link>
            </Nav>
            <Form className="custom-search-container" onSubmit={handleSearchSubmit}>
              <Form.Control
                type="search"
                placeholder="Tìm kiếm"
                className="me-2 custom-search-input"
                aria-label="Tìm kiếm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="dark" type="submit" className="custom-search-button">
                Tìm kiếm
              </Button>
            </Form>
            <Button variant="dark" onClick={handleCartClick} style={{ marginLeft: '10px' }}>
              <ShoppingCartOutlined style={{ fontSize: '24px', color: 'white' }} />
            </Button>
            {accessToken ? (
              userDropdown
            ) : (
              <Button variant="dark" onClick={handleLoginClick} style={{ marginLeft: '10px' }}>
                <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import Footer from "../Common/Footer";
import Header from "../Common/Header";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import http from "../HTTP/http";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../CSS/filter.css";
import "../CSS/checkbox.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(15);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [filters, setFilters] = useState({
    brand: [],
    type: [],
    line: [],
  });
  const [noProducts, setNoProducts] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search");

  useEffect(() => {
    document.title = "MCase";
    fetchData();
    if (localStorage.getItem("selectedCategoryId")) {
      loadProductsFromCate();
    } else if (localStorage.getItem("searchTerm")) {
      searchProducts(localStorage.getItem("searchTerm"));
    } else {
      loadProducts();
    }
  }, [
    localStorage.getItem("searchTerm"),
    localStorage.getItem("selectedCategoryId"),
    page,
  ]);

  const fetchData = async () => {
    try {
      const brandsResponse = await http.get("/api/dongdt");
      setBrands(
        brandsResponse.data.map((item) => ({
          value: item.idDongDT,
          label: item.tenDongDT,
        }))
      );

      const phoneTypesResponse = await http.get("/api/loaidt");
      setPhoneTypes(
        phoneTypesResponse.data.map((item) => ({
          value: item.idLoaiDT,
          label: item.tenLoaiDienThoai,
        }))
      );

      const productLinesResponse = await http.get("/api/danhmucsp");
      setProductLines(
        productLinesResponse.data.map((item) => ({
          value: item.idDanhMuc,
          label: item.tenDanhMuc,
        }))
      );

      // Reset filters here
      setFilters({
        brand: [],
        type: [],
        line: [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const clickPage = (e) => {
    setPage(parseInt(e.target.text));
  };

  const loadProducts = () => {
    http
      .get(`/api/sanpham`)
      .then((response) => {
        console.log("Products data:", response.data);
        const totalPages = Math.ceil(response.data.length / value);
        setProducts(response.data);
        setTotalPages(totalPages);
        setNoProducts(false);

        // Reset filters here
        setFilters({
          brand: [],
          type: [],
          line: [],
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  };

  const loadProductsFromCate = () => {
    const selectedCategoryId = localStorage.getItem("selectedCategoryId");
    http
      .get(`/api/sanpham/danhmuc/${selectedCategoryId}`)
      .then((response) => {
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / value));
        setNoProducts(false);

        // Reset filters here
        setFilters({
          brand: [],
          type: [],
          line: [],
        });
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the products from the category!",
          error
        );
      });
  };

  const handleFilterChange = (filterType, selectedOptions) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleApplyFilters = () => {
    localStorage.removeItem("searchTerm");
    localStorage.removeItem("selectedCategoryId");
    fetchFilteredProducts();
  };

  const fetchFilteredProducts = () => {
    const { brand, type, line } = filters;

    // Constructing query parameters manually
    let params = "";

    if (brand.length) {
      params += `idDongDT=${brand.join(",")}&`;
    }
    if (type.length) {
      params += `idLoaiDT=${type.join(",")}&`;
    }
    if (line.length) {
      params += `idDanhMuc=${line.join(",")}`;
    }

    // Removing the trailing '&' if present
    if (params.endsWith("&")) {
      params = params.slice(0, -1);
    }

    // Sending GET request using axios
    http
      .get(`/api/sanpham/filter?${params}`)
      .then((response) => {
        if (response.data === false) {
          setNoProducts(true);
          setProducts([]);
          setTotalPages(1);
        } else {
          setProducts(response.data);
          setTotalPages(Math.ceil(response.data.length / value));
          setNoProducts(false);
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the filtered products!",
          error
        );
      });
  };

  const searchProducts = (term) => {
    http
      .get(`/api/sanpham/search/${encodeURIComponent(term)}`)
      .then((response) => {
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / value));
        setNoProducts(false);

        // Reset filters here
        setFilters({
          brand: [],
          type: [],
          line: [],
        });
      })
      .catch((error) => {
        console.error("There was an error searching the products!", error);
      });
  };

  const startIndex = (page - 1) * value;
  const currentProducts = products.slice(startIndex, startIndex + value);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const listProducts =
    currentProducts.length > 0 ? (
      currentProducts.map((product) => (
        <Col md={4} key={product.idSanPham} className="d-flex">
          <Card
            style={{ width: "18rem", marginTop: "50px" }}
            className="flex-fill"
          >
            <Link
              to={`/sanpham/detail/${product.idSanPham}`}
              className="text-dark no-underline"
            >
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
      ))
    ) : (
      <Col>
        <p>
          Không tìm thấy sản phẩm nào với từ khóa "
          {localStorage.getItem("searchTerm")}".
        </p>
      </Col>
    );

  let listPage = [];
  for (let index = 0; index < totalPages; index++) {
    const value2 = index + 1;
    listPage.push(
      <Pagination.Item
        key={value2}
        active={value2 === page}
        onClick={clickPage}
      >
        {value2}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Header />
      <Container fluid>
        <Row>
          <Col
            xs={12}
            lg={2}
            className="filter-container"
            style={{ marginTop: "50px" }}
          >
            <div className="filter-section">
              <h5>LOẠI ĐIỆN THOẠI</h5>
              <Select
                isMulti
                options={phoneTypes}
                value={phoneTypes.filter((option) =>
                  filters.type.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleFilterChange("type", selectedOptions)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Chọn loại điện thoại"
              />
            </div>
            <div className="filter-section">
              <h5>DÒNG ĐIỆN THOẠI</h5>
              <Select
                isMulti
                options={brands}
                value={brands.filter((option) =>
                  filters.brand.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleFilterChange("brand", selectedOptions)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Chọn dòng điện thoại"
              />
            </div>
            <div className="filter-section">
              <h5>DANH MỤC SẢN PHẨM</h5>
              <Select
                isMulti
                options={productLines}
                value={productLines.filter((option) =>
                  filters.line.includes(option.value)
                )}
                onChange={(selectedOptions) =>
                  handleFilterChange("line", selectedOptions)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Chọn danh mục sản phẩm"
              />
            </div>
            <Button
              variant="dark"
              className="apply-filters-btn"
              onClick={handleApplyFilters}
            >
              Áp dụng
            </Button>
          </Col>
          <Col xs={12} lg={10}>
            <Row>
              {noProducts ? (
                <Col>
                  <p>Không có sản phẩm nào để hiển thị.</p>
                </Col>
              ) : (
                listProducts
              )}
            </Row>
            <Pagination  className="pagination-container" >{listPage}</Pagination>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Products;

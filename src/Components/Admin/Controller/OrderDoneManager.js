import React, { useState, useEffect } from "react";
import { Table, Button, notification, Typography } from "antd";
import { CheckOutlined, EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import "../../../CSS/ordermanager.css";
import '../../../CSS/ant-table.css';
const { Title } = Typography;

const OrderDoneManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosAdmin.get("/api/getallcartdone");
      setOrders(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch orders.",
      });
    }
  };


  const fetchOrderDetails = async (idDonHang) => {
    try {
      const response = await axiosAdmin.get(`/api/detailcart/${idDonHang}`);
      setSelectedOrder(response.data);
      setViewingDetails(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch order details.",
      });
    }
  };

  const handleViewDetails = (idDonHang) => {
    fetchOrderDetails(idDonHang);
  };

  const handleBackToOrders = () => {
    setViewingDetails(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: "ID Đơn Hàng",
      dataIndex: "idDonHang",
      key: "idDonHang",
      align: "left",
    },
    {
      title: "Tên Người Nhận",
      dataIndex: "tenNguoiNhan",
      key: "tenNguoiNhan",
      align: "left",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "diaChi",
      key: "diaChi",
      align: "left",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "SDT",
      key: "SDT",
      align: "left",
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "phuongThucTT",
      key: "phuongThucTT",
      align: "left",
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "ngayDatHang",
      key: "ngayDatHang",
      render: (text) => formatDate(text),
      align: "left",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "tongTienDH",
      key: "tongTienDH",
      render: (text) => formatPrice(text),
      align: "left",
    },
    {
      title: "Đơn Vị Vận Chuyển",
      dataIndex: "tenDonVi",
      key: "donViVanChuyen",
      align: "left",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text) => (
        <span style={getStatusStyle(text)}>
          {text === "success" && "Giao hàng thành công"}
        </span>
      ),
      align: "left",
    },
    {
      title: "Xem Chi Tiết",
      key: "viewDetails",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.idDonHang)}
        ></Button>
      ),
      
    },
  ];
  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Giao hàng thành công";
      default:
        return "Không xác định";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "success":
        return { color: "green" };
      default:
        return {};
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="order-confirm-manager-container">
      {viewingDetails ? (
        <div className="order-details-container">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToOrders}
            style={{ marginBottom: 16 }}
          >
            Back to Orders
          </Button>
          {selectedOrder ? (
            <div className="order-details-grid">
              <div className="order-details-left">
                <Title level={3} style={{ textAlign: "left" }}>
                  Chi Tiết Đơn Hàng
                </Title>
                <p>ID Đơn Hàng: {selectedOrder.idDonHang}</p>
                <p>Tên Người Nhận: {selectedOrder.tenNguoiNhan || "N/A"}</p>
                <p>Số Điện Thoại Người Nhận: <b>{selectedOrder.SDT || "N/A"}</b></p>
                <p>Địa Chỉ: <b>{selectedOrder.diaChi || "N/A"}</b></p>
                <p>
                  Phương Thức Thanh Toán: {selectedOrder.phuongThucTT || "N/A"}
                </p>
                <p>
                  Ngày Đặt Hàng:{" "}
                  {formatDate(selectedOrder.ngayDatHang) || "N/A"}
                </p>
                <p>
                  Tổng Tiền: {formatPrice(selectedOrder.tongTienDH) || "N/A"}
                </p>
                <p>Nhân viên xác nhận: {selectedOrder.tenNhanVien || "N/A"}</p>
                <p>
                  Trạng Thái:{" "}
                  <span style={getStatusStyle(selectedOrder.trangThai)}>
                    {getStatusText(selectedOrder.trangThai)}
                  </span>
                </p>
              </div>
              <div className="order-details-right">
                <Table
                  columns={[
                    {
                      title: "Sản Phẩm",
                      dataIndex: "tenSanPham",
                      key: "tenSanPham",
                    },
                    {
                      title: "Hình Sản Phẩm",
                      dataIndex: "hinhSP",
                      key: "hinhSP",
                      render: (hinhSP) => <img src={hinhSP} alt="Product" />,
                    },
                    { title: "Số Lượng", dataIndex: "soLuong", key: "soLuong" },
                    {
                      title: "Đơn Giá",
                      dataIndex: "donGia",
                      key: "donGia",
                      render: (text) => formatPrice(text),
                    },
                    {
                      title: "Thành Tiền",
                      dataIndex: "tongTien",
                      key: "tongTien",
                      render: (text) => formatPrice(text),
                    },
                  ]}
                  dataSource={selectedOrder.details || []}
                  rowKey="idChiTietDH"
                  pagination={false}
                  className="order-details-table"
                />
              </div>
            </div>
          ) : (
            <Typography.Text>Loading...</Typography.Text>
          )}
        </div>
      ) : (
        <>
          <Title level={2} style={{ marginBottom: 16 }}>
            Quản Lý Đơn Hàng Đã Giao
          </Title>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="idDonHang"
            pagination={false}
          />
        </>
      )}
    </div>
  );
};

export default OrderDoneManager;

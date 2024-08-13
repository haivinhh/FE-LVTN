import React, { useState, useEffect } from "react";
import { Table, Button, Select, notification, Typography } from "antd";
import {
  CheckOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import "../../../CSS/ordermanager.css"; // Ensure you import the CSS file
import moment from "moment";
import '../../../CSS/ant-table.css';

const { Title } = Typography;
const { Option } = Select;

const OrderConfirmManager = () => {
  const [orders, setOrders] = useState([]);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [loadingOrderId, setLoadingOrderId] = useState(null); // State for managing loading

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchOrders();
    fetchShippingOptions();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosAdmin.get("/api/getallcartwaiting");
      setOrders(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể hiển thị đơn hàng",
      });
    }
  };

  const fetchShippingOptions = async () => {
    try {
      const response = await axiosAdmin.get("/api/dvvc");
      setShippingOptions(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể hiển thị đơn vị vận chuyển",
      });
    }
  };

  const handleConfirmOrder = async (idDonHang, idDonViVanChuyen) => {
    setLoadingOrderId(idDonHang); // Set loading state for the button

    try {
      await axiosAdmin.post("/api/confirmorder", {
        idDonHang,
        idDonViVanChuyen,
      });
      notification.success({
        message: "Xác nhận đơn hàng thành công.",
      });
      fetchOrders(); // Refresh the order list
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to confirm the order.",
      });
    } finally {
      setLoadingOrderId(null); // Revert loading state after request completes
    }
  };

  const fetchOrderDetails = async (idDonHang) => {
    try {
      const response = await axiosAdmin.get(`/api/detailcart/${idDonHang}`);
      console.log(idDonHang)
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
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text) => (
        <span style={getStatusStyle(text)}>
          {text === "waiting" && "Chờ xác nhận"}
        </span>
      ),
      align: "left",
    },
    {
      title: "Đơn Vị Vận Chuyển",
      key: "donViVanChuyen",
      render: (_, record) => (
        <Select
          placeholder="Chọn đơn vị vận chuyển"
          style={{ width: 200 }}
          onChange={(value) =>
            setSelectedOrder({ ...record, idDonViVanChuyen: value })
          }
        >
          {shippingOptions.map((option) => (
            <Option
              key={option.idDonViVanChuyen}
              value={option.idDonViVanChuyen}
            >
              {option.tenDonVi}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Xác Nhận Đơn Hàng",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<CheckOutlined />}
          onClick={() =>
            handleConfirmOrder(
              record.idDonHang,
              selectedOrder?.idDonViVanChuyen
            )
          }
          type="primary"
          loading={loadingOrderId === record.idDonHang} // Show loading state for this specific order
        >
          Xác Nhận
        </Button>
      ),
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "waiting":
        return { color: "orange" };
      default:
        return {};
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "waiting":
        return "Chờ xác nhận";
      case "delivery":
        return "Đang giao";
      case "success":
        return "Giao hàng thành công";
      default:
        return "Không xác định";
    }
  };
  
  const formatDate = (date) => moment(date).format("DD/MM/YYYY HH:mm");

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

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
            Quản Lý Đơn Hàng Chờ Xác Nhận
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

export default OrderConfirmManager;

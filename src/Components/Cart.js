import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import {
  getDetailCart,
  deleteCartItem,
  updateCartItem,
  payCOD,
  payOnline,
} from "../redux/apiRequest";
import { loginSuccess } from "../redux/authSlice";
import { createAxios } from "../redux/createInstance";
import {
  Modal,
  Table,
  Typography,
  Input,
  Space,
  notification,
  Radio,
} from "antd";
import "../CSS/cart.css";
import { Button } from "react-bootstrap";

const { Title, Text } = Typography;

const Cart = () => {
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const idUser = customer?.idUser;
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [idDonHang, setIdDonHang] = useState(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);

    const fetchCart = async () => {
      if (customer?.accessToken) {
        try {
          const result = await getDetailCart(
            customer.accessToken,
            dispatch,
            axiosJWT
          );
          if (result && result.idDonHang) {
            setIdDonHang(result.idDonHang);
          }
        } catch (error) {
          console.error("Failed to fetch cart details:", error);
        }
      }
    };

    fetchCart();
  }, [customer, dispatch]);

  useEffect(() => {
    if (cartData && cartData.length > 0) {
      setIdDonHang(cartData[0]?.idDonHang);
    }
  }, [cartData]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 VND";
    }
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };
  const formatPromotion = (promotion) => {
    if (promotion === undefined || promotion === null || isNaN(promotion)) {
      return "0%";
    }
    // Chuyển đổi số thập phân thành phần trăm và định dạng thành chuỗi
    return `${(promotion * 100).toFixed(0)}%`;
  };
  const handleDeleteCartItem = (idChiTietDH) => {
    setIdToDelete(idChiTietDH);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
    try {
      const result = await deleteCartItem(
        idToDelete,
        customer.accessToken,
        axiosJWT,
        dispatch
      );
      if (result.success) {
        notification.success({
          message: "Xóa sản phẩm thành công",
        });
        await getDetailCart(customer.accessToken, dispatch, axiosJWT);
      } else {
        notification.error({
          message: "Xóa sản phẩm thất bại",
          description: `Lỗi: ${result.error}`, // Corrected
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm trong giỏ hàng:", error);
      notification.error({
        message: "Xóa sản phẩm thất bại",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleQuantityChange = async (idChiTietDH, newQuantity) => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
  
    // Validate quantity
    if (newQuantity < 1) {
      notification.error({
        message: "Cập nhật số lượng thất bại",
        description: "Số lượng sản phẩm không thể nhỏ hơn 1.",
      });
      return;
    }
  
    try {
      const result = await updateCartItem(
        idChiTietDH,
        newQuantity,
        customer.accessToken,
        axiosJWT
      );
      if (result.success) {
        notification.success({
          message: "Cập nhật số lượng thành công",
        });
  
        // Call getDetailCart twice with a 1-second delay between calls
        await getDetailCart(customer.accessToken, dispatch, axiosJWT);
        setTimeout(async () => {
          await getDetailCart(customer.accessToken, dispatch, axiosJWT);
        }, 20); // 1000 milliseconds = 1 second
      } else {
        notification.error({
          message: "Cập nhật số lượng thất bại",
          description: `Lỗi: ${result.message || "Số lượng trong kho không đủ"}`,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      notification.error({
        message: "Cập nhật số lượng thất bại",
        description:
          "Vui lòng thử lại sau hoặc liên hệ với hỗ trợ nếu lỗi vẫn tiếp diễn.",
      });
    }
  };
  

  const handlePayment = async () => {
    if (!idDonHang) {
      notification.error({
        message: "Thanh toán thất bại",
        description: "Không tìm thấy thông tin để thanh toán.",
      });
      return;
    }

    if (paymentMethod === "COD") {
      // Xử lý thanh toán COD như hiện tại
      if (!recipientName || !recipientPhone || !recipientAddress) {
        notification.error({
          message: "Thanh toán thất bại",
          description: "Vui lòng cung cấp đầy đủ thông tin người nhận.",
        });
        return;
      }

      const axiosJWT = createAxios(customer, dispatch, loginSuccess);

      try {
        const result = await payCOD(
          idDonHang,
          customer.accessToken,
          axiosJWT,
          recipientName,
          recipientPhone,
          recipientAddress
        );
        if (result.success) {
          notification.success({
            message: "Đặt hàng thành công",
          });
          await getDetailCart(customer.accessToken, dispatch, axiosJWT);
          setRecipientName("");
          setRecipientPhone("");
          setRecipientAddress("");
        } else {
          notification.error({
            message: "Thanh toán thất bại",
            description: `Lỗi: ${result.error}`,
          });
        }
      } catch (error) {
        console.error("Lỗi khi thanh toán COD:", error);
        notification.error({
          message: "Thanh toán thất bại",
          description: "Vui lòng thử lại.",
        });
      }
    } else if (paymentMethod === "Online") {
      const axiosJWT = createAxios(customer, dispatch, loginSuccess);

      try {
        const result = await payOnline(
          idDonHang,
          customer.accessToken,
          axiosJWT,
          recipientName,
          recipientPhone,
          recipientAddress
        );
        if (result.success) {
          // Chuyển hướng đến orderUrl
          window.location.href = result.orderUrl;
        } else {
          notification.error({
            message: "Thanh toán thất bại",
            description: `Lỗi: ${
              result.message || "Không thể khởi tạo thanh toán online"
            }`,
          });
        }
      } catch (error) {
        console.error("Lỗi khi thanh toán online:", error);
        notification.error({
          message: "Thanh toán thất bại",
          description: "Vui lòng thử lại.",
        });
      }
    } else {
      notification.warning({
        message: "Thanh toán thất bại",
        description: "Chức năng thanh toán không hợp lệ.",
      });
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "hinhSP",
      key: "hinhSP",
      render: (text, record) => (
        <img
          src={record.hinhSP}
          alt={record.tenSanPham}
          style={{ width: "100px", height: "100px", borderRadius: "5px" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      render: (text) => formatPrice(text),
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (text, record) => (
        <Space>
          <Button
            style={{ backgroundColor: "#000", color: "#fff" }}
            onClick={() =>
              handleQuantityChange(record.idChiTietDH, record.soLuong - 1)
            }
          >
            -
          </Button>
          <Input
            type="number"
            value={record.soLuong}
            onChange={(e) =>
              handleQuantityChange(record.idChiTietDH, parseInt(e.target.value))
            }
            style={{ width: "60px", textAlign: "center" }}
          />
          <Button
            style={{ backgroundColor: "#000", color: "#fff" }}
            onClick={() =>
              handleQuantityChange(record.idChiTietDH, record.soLuong + 1)
            }
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "tongTien",
      key: "tongTien",
      render: (text) => formatPrice(text),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="default"
          danger
          style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
          onClick={() => handleDeleteCartItem(record.idChiTietDH)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const buttonText = paymentMethod === "COD" ? "Đặt hàng" : "Thanh toán";

  return (
    <>
      <Header />
      <div className="cart-container">
        <Title level={2}>Giỏ hàng của bạn</Title>
        <div className="cart-table-container">
          <Table
            columns={columns}
            dataSource={cartData}
            pagination={false}
            rowKey="idChiTietDH"
          />
        </div>
        <div className="cart-summary">
          <div className="recipient-info">
            <Title level={4}>Thông tin người nhận</Title>
            <div>
              <Text strong>Tên người nhận:</Text>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nhập họ tên"
              />
            </div>
            <div>
              <Text strong>Số điện thoại:</Text>
              <Input
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <Text strong>Địa chỉ:</Text>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
          <div className="cart-total">
          <Title level={5} >
              Giảm giá: <span style={{color: "red"}}>{formatPromotion(cartData?.[0]?.khuyenMai)}</span>
            </Title>
            <Title level={4}>
              Tổng tiền đơn hàng: {formatPrice(cartData?.[0]?.tongTienDH)}
            </Title>
            
            <div className="payment-method">
              <Title level={4}>Phương thức thanh toán</Title>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                <Radio value="Online">Thanh toán online</Radio>
              </Radio.Group>
            </div>
            <Button
              className="payment-button"
              variant="dark"
              onClick={handlePayment}
            >
              {buttonText}
            </Button>
          </div>
        </div>
        <Modal
          title="Xác nhận"
          visible={showConfirmModal}
          onOk={confirmDelete}
          onCancel={handleCloseModal}
        >
          <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Cart;

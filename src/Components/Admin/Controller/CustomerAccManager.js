import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ArrowLeftOutlined,LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import moment from "moment";
import OrderDetail from "./OrderDetail";  // Import the new OrderDetail component
import ChangePassword from "./ChangePassWord";
import '../../../CSS/ant-table.css';
const { Title } = Typography;
const { confirm } = Modal;

const CustomerAccManager = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form] = Form.useForm();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [viewOrders, setViewOrders] = useState(false); // New state to toggle between views
  const [selectedOrderId, setSelectedOrderId] = useState(null); // State for selected order ID
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false); // State for showing order detail modal
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [selectedUserIdForPasswordChange, setSelectedUserIdForPasswordChange] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosAdmin.get("/api/getallcustomers");
      setCustomers(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể hiện danh sách khách hàng",
        duration: 1.5,
      });
    }
  };

  const fetchOrders = async (customerId) => {
    setSelectedCustomerId(customerId);
    try {
      const response = await axiosAdmin.get(`/api/getcartbyiduser/${customerId}`);
      setOrders(response.data);
      setViewOrders(true);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể hiện danh sách khách hàng",
        duration: 1.5,
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/customer/add", values);
      fetchCustomers();
      setIsModalVisible(false);
      notification.success({
        message: "Success",
        description: "Thêm tài khoản thành công",
        duration: 1.5,
      });
    } catch (error) {
      // Extract the server message if available
      const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : "Thêm tài khoản thất bại";
        
      notification.error({
        message: "Lỗi",
        description: errorMessage,
        duration: 1.5,
      });
    }
  };

  const handleEdit = async (values) => {
    confirm({
      title: "Bạn có chắc chắn muốn sửa thông tin khách hàng này không?",
      onOk: async () => {
        try {
          await axiosAdmin.put(`/api/customer/put/${editingCustomer.idUser}`, values);
          fetchCustomers();
          setIsModalVisible(false);
          form.resetFields();
          setEditingCustomer(null);
          notification.success({
            message: "Success",
            description: "Sửa thông tin khách hàng thành công",
            duration: 1.5,
          });
        } catch (error) {
          // Extract the server message if available
          const errorMessage = error.response && error.response.data && error.response.data.message 
            ? error.response.data.message 
            : "Sửa thông tin khách hàng thất bại";
            
          notification.error({
            message: "Lỗi",
            description: errorMessage,
            duration: 1.5,
          });
        }
      },
      onCancel() {},
    });
  };
  

  const handleDelete = async (id) => {
    confirm({
        title: "Bạn có chắc chắn muốn xóa khách hàng này không?",
        onOk: async () => {
            try {
                await axiosAdmin.delete(`/api/customer/del/${id}`);
                fetchCustomers();
                notification.success({
                    message: "Success",
                    description: "Xóa tài khoản khách hàng thành công",
                    duration: 1.5,
                });
            } catch (error) {
                // Extract the server message if available
                const errorMessage = error.response && error.response.data && error.response.data.message 
                    ? error.response.data.message 
                    : "Không thể xóa khách hàng vì không có quyền.";
                
                notification.error({
                    message: "Lỗi",
                    description: errorMessage,
                    duration: 1.5,
                });
            }
        },
        onCancel() {},
    });
};


  const openModalAdd = () => {
    form.resetFields();
    setEditingCustomer(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };
  const handleViewOrderDetails = (idDonHang) => {
    setSelectedOrderId(idDonHang);
    setIsOrderDetailVisible(true);
  };

  const handleOrderDetailCancel = () => {
    setIsOrderDetailVisible(false);
    setSelectedOrderId(null);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCustomer(null);
  };

  const formatDate = (date) => moment(date).format("DD-MM-YYYY HH:mm");

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "waiting":
        return { color: "orange" };
      case "delivery":
        return { color: "blue" };
      case "success":
        return { color: "green" };
      default:
        return {};
    }
  };

  const customerColumns = [
    {
      title: "ID Khách hàng",
      dataIndex: "idUser",
      key: "idUser",
      align: "left",
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
      align: "left",
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      align: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "SDT",
      key: "SDT",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
    },
    {
      title: "Khách hàng thân thiết",
      dataIndex: "KHThanThiet",
      key: "KHThanThiet",
      align: "left",
      render: (text) => text === 1 ? "X" : "",
    },
    {
      title: "Hành động",
      key: "action",
      align: "left",
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModalEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.idUser)}
            danger
          />
           <Button icon={<LockOutlined />} onClick={() => { 
            setSelectedUserIdForPasswordChange(record.idUser);
            setIsChangePasswordModalVisible(true);
          }} 
          style={{ marginLeft: 8 }}/>
    
        </span>
      ),
    },
    {
      title: "Xem đơn hàng",
      key: "viewOrders",
      align: "left",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => fetchOrders(record.idUser)}
        />
      ),
    },
  ];

  const orderColumns = [
    {
      title: "ID đơn hàng",
      dataIndex: "idDonHang",
      key: "idDonHang",
      align: "left",
    },
    {
      title: "Tên người nhận",
      dataIndex: "tenNguoiNhan",
      key:"tenNguoiNhan",
      align: "left",
    },
    {
      title: "Địa chỉ",
      dataIndex: "diaChi",
      key: "diaChi",
      align: "left",
    },
    {
      title:"Số điện thoại",
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
      title: "Tổng tiền",
      dataIndex: "tongTienDH",
      key: "tongTienDH",
      render: (text) => formatPrice(text),
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text) => (
        <span style={getStatusStyle(text)}>
          {getStatusText(text)}
        </span>
      ),
      align: "left",
    },
    {
      title: "Actions",
      key: "actions",
      align: "left",
      render: (text, record) => (
        <Button
          icon={<EyeOutlined />}
          
          onClick={() => handleViewOrderDetails(record.idDonHang)}
        />
      ),
    },
  ];

  return (
    <>
    <Title level={2} style={{ marginBottom: 16 }}>
            Quản Lý Tài Khoản Khách Hàng
          </Title>
      <div style={{ marginBottom: 16 }}>
        {viewOrders ? (
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setViewOrders(false)}
          >
            Quay lại danh sách khách hàng
          </Button>
        ) : (
          <Button icon={<PlusOutlined />} type="primary" onClick={openModalAdd}>
            Thêm tài khoản khách hàng
          </Button>
        )}
      </div>

      {viewOrders ? (
        <Table columns={orderColumns} dataSource={orders} rowKey="idDonHang" />
      ) : (
        <Table columns={customerColumns} dataSource={customers} rowKey="idUser" />
      )}

      <Modal
        title={editingCustomer ? "Chỉnh sửa tài khoản khách hàng" : "Thêm tài khoản khách hàng"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingCustomer ? handleEdit : handleAdd}
        >
          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="userName"
            label="Username"
            rules={[{ required: true, message: "Please enter the username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="SDT"
            label="Số điện thoại"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email" }]}
          >
            <Input />
          </Form.Item>
          {!editingCustomer && (
            <>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { 
                  required: true, 
                  message: "Vui lòng nhập mật khẩu!" 
                },
                { 
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                  message: "Mật khẩu phải chứa ít nhất một chữ cái, một số và có ít nhất 6 ký tự!" 
                }
              ]}
            >
              <Input.Password style={{ width:"350px" }}/>
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              hasFeedback
              rules={[
                { 
                  required: true, 
                  message: "Vui lòng xác nhận mật khẩu!" 
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password style={{ width:"350px" }}/>
            </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCustomer ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {selectedOrderId && (
        <OrderDetail
          visible={isOrderDetailVisible}
          orderId={selectedOrderId}
          onCancel={handleOrderDetailCancel}
        />
      )}
        <ChangePassword    visible={isChangePasswordModalVisible}
        onCancel={() => setIsChangePasswordModalVisible(false)}
        idUser={selectedUserIdForPasswordChange}/>
      
    </>
  );
};


export default CustomerAccManager;
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, notification ,Typography} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined,EyeOutlined  } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import ChangePasswordUser from "./ChangePassWorduser";
import OrdersTable from "./OrderConfirmedByStaff";

const { Option } = Select;
const { Title } = Typography;
const StaffManager = () => {
  const [staffs, setStaffs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingStaff, setEditingStaff] = useState(null);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);
  const [selectedUserIdForPasswordChange, setSelectedUserIdForPasswordChange] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const response = await axiosAdmin.get("/api/getallusers");
      setStaffs(response.data);
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : "Không thể lấy danh sách nhân viên.";
      notification.error({
        message: "Lỗi",
        description: errorMessage,
        duration: 1.5,
      });
    }
  };

  const fetchConfirmedOrders = async (idNhanVien) => {
    try {
      const response = await axiosAdmin.get(`/api/confirmorderbyuser/admin/${idNhanVien}`);
      setOrders(response.data);
      setCurrentUserId(idNhanVien);
      setIsOrdersModalVisible(true);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể lấy đơn hàng đã xác nhận.",
        duration: 1.5,
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/user/add", values);
      fetchStaffs();
      setIsModalVisible(false);
      notification.success({
        message: "Thành công",
        description: "Đã thêm nhân viên thành công.",
        duration: 1.5,
      });
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm nhân viên.",
        duration: 1.5,
      });
    }
  };

  const handleEdit = async (values) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn sửa thông tin nhân viên này không?",
      onOk: async () => {
        try {
          await axiosAdmin.put(`/api/users/${editingStaff.idNhanVien}`, {
            ...values,
            chucVu: values.admin  // Correctly map the form field to the API field
          });
          fetchStaffs();
          setIsModalVisible(false);
          form.resetFields();
          setEditingStaff(null);
          notification.success({
            message: "Thành công",
            description: "Đã cập nhật nhân viên thành công.",
            duration: 1.5,
          });
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: "Không thể cập nhật nhân viên.",
            duration: 1.5,
          });
        }
      },
    });
  };
  

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa nhân viên này không?",
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/api/users/${id}`);
          fetchStaffs();
          notification.success({
            message: "Thành công",
            description: "Đã xóa nhân viên thành công.",
            duration: 1.5,
          });
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: "Không thể xóa nhân viên.",
            duration: 1.5,
          });
        }
      },
    });
  };

  const openModalAdd = () => {
    form.resetFields();
    setEditingStaff(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (staff) => {
    setEditingStaff(staff);
    form.setFieldsValue({
      hoTen: staff.hoTen,
      userName: staff.userName,
      diaChi: staff.diaChi,
      SDT: staff.SDT,
      email: staff.email,
      admin: staff.admin,  // Make sure this is correctly mapped
    });
    setIsModalVisible(true);
  };
  

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingStaff(null);
  };

  const staffColumns = [
    {
      title: "ID Nhân viên",
      dataIndex: "idNhanVien",
      key: "idNhanVien",
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
      title: "Địa chỉ",
      dataIndex: "diaChi",
      key: "diaChi",
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
      title: "Chức vụ",
      dataIndex: "admin",
      key: "chucVu",
      align: "left",
      render: (text) => (text === 1 ? "Admin" : "Staff"),
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
            onClick={() => handleDelete(record.idNhanVien)}
            danger
          />
          <Button
            icon={<LockOutlined />}
            onClick={() => {
              setSelectedUserIdForPasswordChange(record.idNhanVien);
              setIsChangePasswordModalVisible(true);
              console.log(record.idNhanVien);
            }}
            style={{ marginLeft: 8 }}
          />
         
        </span>
      ),
    },
    {
        title: "Xem chi tiết",
        key: "action",
      align: "left", 
      render: (_, record) => (
        <span>
         
          <Button
            onClick={() => fetchConfirmedOrders(record.idNhanVien)}
            icon={<EyeOutlined />}
            style={{ marginLeft: 8 }}
          />
           
        </span>
      ),       
    }
  ];

  const handleBack = () => {
    setIsOrdersModalVisible(false);
    setCurrentUserId(null); // Clear userId on back
  };

  return (
    <>
    <Title level={2} style={{ marginBottom: 16 }}>
            Quản Lý Nhân Viên
          </Title>
      {!isOrdersModalVisible ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button icon={<PlusOutlined />} type="primary" onClick={openModalAdd}>
              Thêm Nhân Viên
            </Button>
          </div>
          <Table
            dataSource={staffs}
            columns={staffColumns}
            rowKey="idNhanVien"
          />
          <Modal
            title={editingStaff ? "Cập nhật nhân viên" : "Thêm nhân viên"}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={editingStaff ? handleEdit : handleAdd}
            >
              <Form.Item
                name="hoTen"
                label="Họ tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="userName"
                label="Username"
                rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="diaChi"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="SDT"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="admin"
                label="Chức vụ"
                rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
                style={{ width:"350px"}}
              >
                <Select>
                  <Option value={1}>Admin</Option>
                  <Option value={0}>Staff</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 8 }}
                >
                  {editingStaff ? "Cập nhật" : "Thêm"}
                </Button>
                <Button onClick={handleCancel}>Hủy</Button>
              </Form.Item>
            </Form>
          </Modal>
          <ChangePasswordUser
  visible={isChangePasswordModalVisible}
  onCancel={() => setIsChangePasswordModalVisible(false)}
  idNhanVien={selectedUserIdForPasswordChange}  // Pass idNhanVien correctly here
/>

        </>
      ) : (
        <OrdersTable
          userId={currentUserId}
          onBack={handleBack}
          orders={orders}
        />
      )}
    </>
  );
};

export default StaffManager;

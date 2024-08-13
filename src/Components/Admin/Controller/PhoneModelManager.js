import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import http from "../../../HTTP/http";
import "../../../CSS/ant-table.css";
const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;

const PhoneModelManager = () => {
  const [phoneModels, setPhoneModels] = useState([]);
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingModel, setEditingModel] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchPhoneModels();
    fetchPhoneTypes();
  }, []);

  const fetchPhoneModels = async () => {
    try {
      const response = await axiosAdmin.get("/api/dongdtql");
      setPhoneModels(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể hiển thị danh sách dòng điện thoại",
      });
    }
  };

  const fetchPhoneTypes = async () => {
    try {
      const response = await axiosAdmin.get("/api/loaidtql");
      setPhoneTypes(response.data);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể hiển thị danh sách loại điện thoại",
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/dongdtql/add", values);
      fetchPhoneModels();
      setIsModalVisible(false);
      notification.success({
        message: "Success",
        description: "Thêm dòng điện thoại thành công",
      });
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Thêm dòng điện thoại thất bại",
      });
    }
  };

  const handleEdit = async (values) => {
    confirm({
      title: "Bạn có chắc chắn muốn sửa thông tin dòng điện thoại này không?",
      onOk: async () => {
        try {
          await axiosAdmin.put(
            `/api/dongdtql/put/${editingModel.idDongDT}`,
            values
          );
          fetchPhoneModels();
          setIsModalVisible(false);
          form.resetFields();
          setEditingModel(null);
          notification.success({
            message: "Success",
            description: "Sửa dòng điện thoại thành công",
          });
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: "Sửa dòng điện thoại thất bại",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDelete = async (idDongDT) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa dòng điện thoại này không?",
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/api/dongdtql/del/${idDongDT}`);
          fetchPhoneModels();
          notification.success({
            message: "Success",
            description: "Xóa dòng điện thoại thành công",
          });
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: "Xóa dòng điện thoại thất bại",
          });
        }
      },
      onCancel() {},
    });
  };

  const openModalAdd = () => {
    form.resetFields();
    setEditingModel(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (model) => {
    setEditingModel(model);
    form.setFieldsValue(model);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingModel(null);
  };
  const getPhoneTypeName = (id) => {
    const phoneType = phoneTypes.find((phoneT) => phoneT.idLoaiDT === id);
    return phoneType ? phoneType.tenLoaiDienThoai : "";
  };

  const columns = [
    {
      title: "ID Dòng Điện Thoại",
      dataIndex: "idDongDT",
      key: "idDongDT",
      align: "left",
    },
    {
      title: "Tên Dòng Điện Thoại",
      dataIndex: "tenDongDT",
      key: "tenDongDT",
      align: "left",
    },
    {
      title: "Loại Điện Thoại",
      dataIndex: "loaiDienThoai",
      key: "loaiDienThoai",
      render: (text) => getPhoneTypeName(text),
      align: "left",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModalEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.idDongDT)}
            danger
          />
        </span>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <Title level={2} style={{ marginBottom: 16 }}>
        Quản Lý Dòng Điện Thoại
      </Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={openModalAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm Dòng Điện Thoại
      </Button>
      <Table columns={columns} dataSource={phoneModels} rowKey="idDongDT" pagination={{ pageSize: 20 }}  />
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            {editingModel ? "Sửa Dòng Điện Thoại" : "Thêm Dòng Điện Thoại"}
          </div>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={editingModel ? handleEdit : handleAdd}>
          <Form.Item
            name="tenDongDT"
            label="Tên Dòng Điện Thoại"
            rules={[
              { required: true, message: "Vui lòng nhập tên dòng điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="loaiDienThoai"
            label="Loại Điện Thoại"
            rules={[
              { required: true, message: "Vui lòng chọn loại điện thoại!" },
            ]}
          >
            <Select placeholder="Chọn loại điện thoại">
              {phoneTypes.map((type) => (
                <Option key={type.idLoaiDT} value={type.idLoaiDT}>
                  {type.tenLoaiDienThoai}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingModel ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PhoneModelManager;

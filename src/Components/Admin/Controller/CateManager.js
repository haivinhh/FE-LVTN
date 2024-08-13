import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification,Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  loginAdminSuccess,
  logOutSuccess,
} from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";


import "../../../CSS/ant-table.css";
const { Title } = Typography;
const { confirm } = Modal;

const CateManager = () => {
  const [categories, setCategories] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosAdmin.get("/api/danhmucspql");
      setCategories(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch categories.",
        duration: 1.5,
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/danhmucspql/add", values);
      fetchCategories();
      setIsModalVisible(false);
      notification.success({
        message: "Success",
        description: "Thêm Danh Mục Sản Phẩm Thành Công",
        duration: 1.5,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add category.",
        duration: 1.5,
      });
    }
  };

  const handleEdit = async (values) => {
    confirm({
      title: "Bạn có chắc chắn muốn sửa thông tin danh mục này không?",
      onOk: async () => {
        try {
          await axiosAdmin.put(
            `/api/danhmucspql/put/${editingCategory.idDanhMuc}`,
            values
          );
          fetchCategories();
          setIsModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
          notification.success({
            message: "Success",
            description: "Sửa thông tin danh mục thành công.",
            duration: 1.5,
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to update category.",
            duration: 1.5,
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDelete = async (idDanhMuc) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa danh mục này không?",
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/api/danhmucspql/del/${idDanhMuc}`);
          fetchCategories();
          notification.success({
            message: "Success",
            description: "Xóa danh mục thành công.",
            duration: 1.5,
          });
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: `Không thể xóa danh mục ${idDanhMuc}`,
            duration: 1.5,
          });
        }
      },
      onCancel() {},
    });
  };

  const openModalAdd = () => {
    form.resetFields();
    setEditingCategory(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const columns = [
    {
      title: "ID danh mục",
      dataIndex: "idDanhMuc",
      key: "idDanhMuc",
      align: "left",
    },
    {
      title: "Tên danh mục",
      dataIndex: "tenDanhMuc",
      key: "tenDanhMuc",
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
            onClick={() => handleDelete(record.idDanhMuc)}
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
        Quản Lý Danh Mục Sản Phẩm
      </Title>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={openModalAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm danh mục
      </Button>
      <Table columns={columns} dataSource={categories} rowKey="idDanhMuc" />
      <Modal
        title={
          <div style={{ textAlign: "center" }}>
            {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
          </div>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={editingCategory ? handleEdit : handleAdd}>
          <Form.Item
            name="tenDanhMuc"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingCategory ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CateManager;

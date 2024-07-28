import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, notification, InputNumber } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess, logOutAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import http from "../../../HTTP/http";

const { Option } = Select;
const { confirm } = Modal;

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [phoneLines, setPhoneLines] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchPhoneLines();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosAdmin.get("/api/sanphamql");
      setProducts(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch products.",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosAdmin.get("/api/danhmucspql");
      setCategories(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch categories.",
      });
    }
  };

  const fetchPhoneLines = async () => {
    try {
      const response = await axiosAdmin.get("/api/dongdtql");
      setPhoneLines(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch phone lines.",
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/sanpham", values);
      fetchProducts();
      setIsModalVisible(false);
      notification.success({
        message: "Success",
        description: "Product added successfully.",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add product.",
      });
    }
  };

  const handleEdit = async (values) => {
    confirm({
      title: 'Bạn có chắc chắn muốn sửa thông tin sản phẩm này không?',
      onOk: async () => {
        try {
          await axiosAdmin.put(`/api/sanpham/${editingProduct.idSanPham}`, values);
          fetchProducts();
          setIsModalVisible(false);
          form.resetFields();
          setEditingProduct(null);
          notification.success({
            message: "Success",
            description: "Sửa thông tin sản phẩm thành công.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to update product.",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDelete = async (idSanPham) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/api/sanpham/${idSanPham}`);
          fetchProducts();
          notification.success({
            message: "Success",
            description: "Xóa sản phẩm thành công.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to delete product.",
          });
        }
      },
      onCancel() {},
    });
  };

  const openModalAdd = () => {
    form.resetFields();
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  // Helper functions to get names by ID
  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.idDanhMuc === id);
    return category ? category.tenDanhMuc : '';
  };

  const getPhoneLineName = (id) => {
    const phoneLine = phoneLines.find(line => line.idDongDT === id);
    return phoneLine ? phoneLine.tenDongDT : '';
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Giá",
      dataIndex: "donGia",
      key: "donGia",
    },
    {
      title: "Thông tin",
      dataIndex: "thongTinSP",
      key: "thongTinSP",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Hình sản phẩm",
      dataIndex: "hinhSP",
      key: "hinhSP",
      render: (text, record) => (
        <img
          src={text}
          alt={record.tenSanPham}
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Danh mục sản phẩm",
      dataIndex: "danhMucSP",
      key: "danhMucSP",
      render: (text) => getCategoryName(text),
    },
    {
      title: "Dòng điện thoại",
      dataIndex: "dongDT",
      key: "dongDT",
      render: (text) => getPhoneLineName(text),
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
            onClick={() => handleDelete(record.idSanPham)}
            danger
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={openModalAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm
      </Button>
      <Table columns={columns} dataSource={products} rowKey="idSanPham" />
      <Modal
        title={<div style={{ textAlign: 'center' }}>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingProduct ? handleEdit : handleAdd}
        >
          <Form.Item
            name="tenSanPham"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="donGia"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="thongTinSP"
            label="Thông tin sản phẩm"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="soLuong"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="hinhSP"
            label="Hình sản phẩm"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="danhMucSP"
            label="Danh mục sản phẩm"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục sản phẩm!' }]}
          >
            <Select>
              {categories.map((cat) => (
                <Option key={cat.idDanhMuc} value={cat.idDanhMuc}>
                  {cat.tenDanhMuc}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dongDT"
            label="Dòng điện thoại"
            rules={[{ required: true, message: 'Vui lòng chọn dòng điện thoại!' }]}
          >
            <Select>
              {phoneLines.map((line) => (
                <Option key={line.idDongDT} value={line.idDongDT}>
                  {line.tenDongDT}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {editingProduct ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductManager;

import React from "react";
import { Modal, Form, Input, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createAxiosAdmin } from "../../../redux/createInstance";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";

const ChangePasswordUser = ({ visible, onCancel, idNhanVien }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  const handleOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          if (!values.newPassword || !values.confirmPassword) {
            notification.error({
              message: "Lỗi",
              description: "Vui lòng nhập đầy đủ thông tin.",
            });
            return;
          }

          console.log("Sending values to server:", { newPassword: values.newPassword, idNhanVien });
          await axiosAdmin.put("/api/changePassword", { newPassword: values.newPassword, idNhanVien });
          notification.success({
            message: "Success",
            description: "Thay đổi mật khẩu thành công",
          });
          onCancel();
          form.resetFields();
        } catch (error) {
          console.error("Lỗi khi thay đổi mật khẩu:", error);
          notification.error({
            message: "Lỗi",
            description: "Thay đổi mật khẩu thất bại",
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Đổi mật khẩu"
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ newPassword: "", confirmPassword: "" }}
      >
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: "Mật khẩu mới là bắt buộc" }]}
        >
          <Input.Password style={{ width: "350px" }} />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Xác nhận mật khẩu là bắt buộc" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password style={{ width: "350px" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordUser;

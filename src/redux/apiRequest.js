import http from "../HTTP/http"; // Ensure this import is correct based on your configuration
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutStart,
  logOutFailed,
  logOutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import {
  getCartStart,
  getCartSuccess,
  getCartFailed,
  getCartLogout,
} from "./cartSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await http.post("/api/cuslogin", user);
    dispatch(loginSuccess(res.data));
    return { status: "success" };
  } catch (err) {
    dispatch(loginFailed());
    return { status: "failed", error: err.response.data };
  }
};

export const registerCus = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await http.post("/api/cusregister", user);
    dispatch(registerSuccess());
    return { success: true }; // Return success status
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.";
    dispatch(registerFailed(errorMessage));
    return { success: false, message: errorMessage }; // Return error status and message
  }
};

export const logOutCus = async (dispatch, navigate, accessToken, axiosJWT) => {
  dispatch(logOutStart());
  try {
    // Ensure the headers are included correctly
    await axiosJWT.post(
      "/api/cuslogout",
      {},
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    dispatch(logOutSuccess());
    dispatch(getCartLogout());
    navigate("/");
  } catch (err) {
    console.error("Logout failed:", err);
    dispatch(logOutFailed());
  }
};

export const getDetailCart = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getCartStart());
  try {
    const res = await axiosJWT.get("/api/detailcart", {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getCartSuccess(res.data));
  } catch (err) {
    dispatch(getCartFailed());
  }
};
export const getDetailCartOfUser = async (
  accessToken,
  idDonHang,
  dispatch,
  axiosJWT
) => {
  dispatch(getCartStart());
  try {
    const res = await axiosJWT.get(`/api/getdetailcart/${idDonHang}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(getCartSuccess(res.data));
  } catch (err) {
    dispatch(getCartFailed());
  }
};
export const createOrUpdateCart = async (
  idSanPham,
  soLuong,
  accessToken,
  axiosJWT
) => {
  try {
    const response = await axiosJWT.post(
      "/api/cart/add",
      { idSanPham, soLuong },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return {
        success: false,
        error: response.data.message || "Failed to add or update cart item",
      };
    }
  } catch (err) {
    console.error("Error adding or updating cart item:", err);
    return {
      success: false,
      error: err.response?.data?.message || err.message,
    };
  }
};

export const updateCartItem = async (
  idChiTietDH,
  soLuong,
  accessToken,
  axiosJWT
) => {
  try {
    const response = await axiosJWT.put(
      "/api/cart/updatecartitem",
      { idChiTietDH, soLuong },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    if (response.data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: "Cập nhật sản phẩm trong giỏ hàng thất bại",
      };
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật sản phẩm trong giỏ hàng:", err);
    return { success: false, error: err.response?.data || err.message };
  }
};

export const deleteCartItem = async (idChiTietDH, accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.delete("/api/cart/deletecartitem", {
      headers: {
        token: `Bearer ${accessToken}`,
      },
      data: { idChiTietDH },
    });

    if (response.data.success) {
      return { success: true };
    } else {
      return { success: false, error: "Xóa sản phẩm trong giỏ hàng thất bại" };
    }
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm trong giỏ hàng:", err);
    return { success: false, error: err.response?.data || err.message };
  }
};
export const getCusById = async (idUser, accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.get(`/api/getcusbyid`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};
export const getCart = async (idUser, accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.get(`/api/cart`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};

export const changePassword = async (
  currentPassword,
  newPassword,
  accessToken,
  axiosJWT
) => {
  try {
    const response = await axiosJWT.post(
      "/api/changepassword",
      { currentPassword, newPassword },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    // Extract message from response data
    const { message } = response.data;

    // Check if the password change was successful
    if (message === "Password changed successfully.") {
      return { success: true };
    } else {
      return { success: false, error: message };
    }
  } catch (err) {
    console.error("Error changing password:", err);
    // Handle cases where server error messages are present
    const errorMessage = err.response?.data?.message || err.message;
    return { success: false, error: errorMessage };
  }
};
export const updateUser = async (idUser, accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.put("/api/updateuser", idUser, {
      headers: { token: `Bearer ${accessToken}` },
    });
    const { message } = response.data;

    if (message === "Cập nhật thông tin thành công.") {
      return { success: true, message: "Cập nhật thông tin thành công" };
    } else if (message === "Địa chỉ email không hợp lệ") {
      return {
        success: false,
        message: message || "Địa chỉ email không hợp lệ",
      };
    } else {
      return {
        success: false,
        message: message || "Cập nhật thông tin thất bại",
      };
    }
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

export const getCustomerAddress = async (accessToken, axiosJWT) => {
  try {
    const response = await axiosJWT.get("/api/address", {
      headers: { token: `Bearer ${accessToken}` },
    });
    return { success: true, address: response.data };
  } catch (error) {
    console.error("Error fetching customer address:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateCustomerAddress = async (
  newAddress,
  accessToken,
  axiosJWT
) => {
  try {
    const response = await axiosJWT.put(
      "/api/address",
      { newAddress },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    const { message } = response.data;

    if (message === "Address updated successfully.") {
      return { success: true, message: "Address updated successfully" };
    } else {
      return { success: false, message: message || "Failed to update address" };
    }
  } catch (error) {
    console.error("Error updating customer address:", error);
    return { success: false, error: error.response?.data || error.message };
  }
};
export const cancelOrder = async (idDonHang, accessToken, axiosJWT) => {
  try {
    // Make the API request to cancel the order
    const response = await axiosJWT.post(
      "/api/cancelorder",
      { idDonHang },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    // Check the response to determine the outcome
    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to cancel the order.",
      };
    }
  } catch (err) {
    console.error("Error canceling order:", err);
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

export const payCOD = async (
  idDonHang,
  accessToken,
  axiosJWT,
  recipientName,
  recipientPhone,
  recipientAddress
) => {
  try {
    if (!axiosJWT) {
      throw new Error("Axios instance is not defined");
    }

    const response = await axiosJWT.post(
      "/api/paycod",
      {
        idDonHang,
        recipientName,
        recipientPhone,
        recipientAddress,
      },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to process payment",
      };
    }
  } catch (err) {
    console.error("Error processing COD payment:", err);
    return {
      success: false,
      message: err.response?.data.message || err.message,
    };
  }
};
export const checkOrderStatus = async (accessToken, app_trans_id, axiosJWT) => {
  try {
    // Call the ZaloPay check order status API endpoint
    const response = await axiosJWT.post(
      `/api/checkorderstatus/${app_trans_id}`, // Pass app_trans_id in the URL parameters
      {}, // No need to pass data in the request body
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    // Check the response to determine the outcome
    if (response.data.return_code === 1) {
      // Successfully checked order status
      return {
        success: true,
        data: response.data,
      };
    } else {
      // Failed to check order status
      return {
        success: false,
        message:
          response.data.return_message || "Failed to check order status.",
      };
    }
  } catch (error) {
    // Handle errors during API call
    console.error("Error checking order status:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};
export const payOnline = async (
  idDonHang,
  accessToken,
  axiosJWT,
  recipientName,
  recipientPhone,
  recipientAddress
) => {
  try {
    if (!axiosJWT) {
      throw new Error("Axios instance is not defined");
    }

    const response = await axiosJWT.post(
      "/api/createpayment", // Đường dẫn API của bạn
      {
        idDonHang,
        tenNguoiNhan: recipientName,
        SDT: recipientPhone,
        diaChi: recipientAddress,
      },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 200) {
      console.log("Order URL:", response.data.order_url);
      return {
        success: true,
        message: response.data.message,
        orderUrl: response.data.order_url, // Giả sử `orderUrl` được trả về từ API
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to process online payment.",
      };
    }
  } catch (error) {
    console.error("Error processing online payment:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const processRefund = async (idDonHang, accessToken, axiosJWT) => {
  try {
    if (!axiosJWT) {
      throw new Error("Axios instance is not defined");
    }

    const response = await axiosJWT.post(
      "/api/processRefundAndCheckStatus", // Đường dẫn API của bạn
      { idDonHang },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );

    if (response.status === 200) {
      console.log("Kết quả hoàn tiền và kiểm tra trạng thái:", response.data);
      return {
        success: true,
        message: response.data.message,
        data: response.data, 
      };
    } else {
      return {
        success: false,
        message:
          response.data.message ||
          "Không thể xử lý hoàn tiền và kiểm tra trạng thái.",
      };
    }
  } catch (error) {
    console.error("Lỗi khi xử lý hoàn tiền và kiểm tra trạng thái:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi xử lý hoàn tiền và kiểm tra trạng thái.",
    };
  }
};

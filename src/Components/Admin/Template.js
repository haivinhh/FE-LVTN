import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GroupOutlined,
  UserOutlined,
  ProductOutlined,
  ShoppingOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../Icon/logo.jpg'; // Import your logo image
import '../../CSS/template.css'; // Import your CSS file
import ProductManager from './Controller/ProductManager'; // Import ProductManager component
import { logOut } from '../../redux/APIAdmin/APIAdmin'; // Import your logOut function
import { createAxiosAdmin} from "../../redux/createInstance"; // Import the createAxiosAdmin and checkRefreshToken functions
import { logOutAdminSuccess } from "../../redux/authSliceAdmin";
import CateManager from './Controller/CateManager';
import PhoneTypeManager from './Controller/PhoneTypeManager';
import PhoneModelManager from './Controller/PhoneModelManager';
import ShipManager from './Controller/ShipManager';
import OrderManager from './Controller/OrderManager';
import OrderConfirmManager from './Controller/OrderConfirmManager';
import OrderDeliveryManager from './Controller/OrderDeliverManager';
import OrderDoneManager from './Controller/OrderDoneManager';
import CustomerAccManager from './Controller/CustomerAccManager';
import ProfileManager from './Controller/ProfileManager';
import StaffManager from './Controller/StaffManager';
import MostSoldProductsChart from './Controller/MostSoldProducts';
import TopCustomersChart from './Controller/TopCustomers';
import RevenueByYearChart from './Controller/RevenueByYear';
const { Header, Sider, Content } = Layout;

const Template = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1'); // Track the selected menu item
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const idNhanVien = user?.idNhanVien;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = user?.accessToken; // Get accessToken from Redux store

  // Create Axios instance for admin
  let axiosAdmin = createAxiosAdmin(user, logOutAdminSuccess, dispatch);

  // Handler for logout
  const handleLogout = async () => {
    try {
      await logOut(dispatch, idNhanVien, navigate, accessToken, axiosAdmin);
      message.success('Logged out successfully');
      dispatch(logOutAdminSuccess());
      navigate("/admin");
    } catch (error) {
      message.error('Logout failed');
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = async (key) => {
    
      setSelectedMenu(key);
   
  };

  // Dropdown menu items
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => handleMenuClick('profile')}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  

  return (
    <Layout> {/* Ensure Layout takes full height */}
      <Sider trigger={null} collapsible collapsed={collapsed} className="sider-custom"
      width={270}>
        {!collapsed && (
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]} // Set selected key for menu
          items={[
            {
              key: "1",
              icon: <ProductOutlined />,
              label: "Quản Lý Sản Phẩm",
              onClick: () => handleMenuClick("1"),
              style:{textAlign: "left"}
            },
            {
              key: "2",
              icon: <GroupOutlined />,
              label: "Quản Lý Danh Mục Sản Phẩm",
              onClick: () => handleMenuClick("2"),
              style:{textAlign: "left"}
            },
            {
              key: "3",
              icon: <GroupOutlined />,
              label: "Quản Lý Dòng Điện Thoại",
              onClick: () => handleMenuClick("3"),
              style:{textAlign: "left"}
            },
            {
              key: "4",
              icon: <GroupOutlined />,
              label: "Quản Lý Loại Điện Thoại",
              onClick: () => handleMenuClick("4"),
              style:{textAlign: "left"}
            },
            {
              key: "5",
              icon: <UserOutlined />,
              label: "Quản Lý Tài Khoản Nhân Viên",
              onClick: () => handleMenuClick("5"),
              style:{textAlign: "left"}
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: "Quản Lý Tài Khoản Khách Hàng",
              onClick: () => handleMenuClick("6"),
              style:{textAlign: "left"}
            },
            {
              key: "7",
              icon: <UserOutlined />,
              label: "Quản Lý Đơn Vị Vận Chuyển",
              onClick: () => handleMenuClick("7"),
              style:{textAlign: "left"}
            },
            {
              key: "8",
              icon: <ShoppingOutlined />,
              label: "Quản Lý Đơn Hàng",
              onClick: () => handleMenuClick("8"),
              style:{textAlign: "left"}
            },
            {
              key: "9",
              icon: <ShoppingOutlined />,
              label: "Quản Lý Đơn Hàng Chờ Xác Nhận",
              onClick: () => handleMenuClick("9"),
              style:{textAlign: "left"}
            },
            {
              key: "10",
              icon: <ShoppingOutlined />,
              label: "Quản Lý Đơn Hàng Đang Giao",
              onClick: () => handleMenuClick("10"),
              style:{textAlign: "left"}
            },
            {
              key: "11",
              icon: <ShoppingOutlined />,
              label: "Quản Lý Đơn Hàng Đã Giao",
              onClick: () => handleMenuClick("11"),
              style:{textAlign: "left"}
            },

            {
              key: "12",
              icon: <LineChartOutlined />,
              label: "Thống kê sản phẩm",
              onClick: () => handleMenuClick("12"),
              style:{textAlign: "left"}
            },
            {
              key:"14",
              icon: <LineChartOutlined />,
              label: "Thống kê khách hàng",
              onClick: () => handleMenuClick("14"),
              style:{textAlign: "left"}
            },
            {
              key:"15",
              icon: <LineChartOutlined />,
              label: "Thống kê doanh thu",
              onClick: () => handleMenuClick("15"),
              style:{textAlign: "left"}
            }
            
            
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#031220',
          }}
        >
          <div className="header-custom">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: '#fff',
              }}
            />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{
                  fontSize: '16px',
                  color: '#fff',
                  marginLeft: 'auto', // Push to the right
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selectedMenu === 'profile' && <ProfileManager />}

          {selectedMenu === '1' && <ProductManager />} 
          {selectedMenu === '2' && <CateManager />}
          {selectedMenu === '3' && <PhoneModelManager />}
          {selectedMenu === '4' && <PhoneTypeManager />}
          {selectedMenu === '5' && <StaffManager />}
          {selectedMenu === '6' && <CustomerAccManager/>}
          {selectedMenu === '7' && <ShipManager />}
          {selectedMenu === '8' && <OrderManager />}
          {selectedMenu === '9' && <OrderConfirmManager/>}
          {selectedMenu === '10' && <OrderDeliveryManager />}
          {selectedMenu === '11' && <OrderDoneManager/>}
          {selectedMenu === '12' && <MostSoldProductsChart/>}
          {selectedMenu === '14' && <TopCustomersChart/>}
          {selectedMenu === '15' && <RevenueByYearChart/>}

        </Content>
      </Layout>
    </Layout>
  );
};

export default Template;

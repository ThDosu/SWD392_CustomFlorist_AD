import React from 'react';
import { Button } from 'react-bootstrap';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import { House, Gem, Heart, Box, BarChart, BoxArrowRight, BoxSeam, PlusCircle } from 'react-bootstrap-icons';
import Header from './HeaderSidebar';

const SalerSidebar = ({ children }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    const handleToggle = () => {
        setCollapsed(!collapsed);
    };

    const menuItemStyles = {
        button: ({ level, active }) => {
            return {
                color: active ? '#fff' : '#333',
                backgroundColor: active ? '#ff69b4' : 'transparent',
                '&:hover': {
                    backgroundColor: '#ffb6c1',
                    color: '#fff',
                },
            };
        },
    };

    return (
        <div className="flex h-screen" style={{ display: "flex" }}>
            <Sidebar
                collapsed={collapsed}
                width={collapsed ? '80px' : '250px'}
                collapsedWidth="80px"
                className="h-full"
                backgroundColor="#fef0f5"
                style={{ position: "fixed", height: "100vh", overflowY: "auto", zIndex: 1000 }}
            >
                <div className="p-4 flex-grow">
                    <Button
                        style={{ backgroundColor: '#ff69b4', color: '#fff', borderColor: '#ff69b4' }}
                        onClick={handleToggle}
                        className="mb-4 w-full"
                    >
                        {collapsed ? '≡' : 'BloomGift'}
                    </Button>
                    <Menu iconShape="circle" menuItemStyles={menuItemStyles} >
                        <MenuItem style={{ paddingLeft: "0px" }} icon={<House />} component={<NavLink to="/banhang/dashboard" />}>
                            Thống Kê
                        </MenuItem>
                        <MenuItem style={{ paddingLeft: "0px" }} icon={<Heart />} component={<NavLink to="/banhang/all-promotion" />}>
                            Quản Lý Khuyến Mãi
                        </MenuItem>
                        <MenuItem style={{ paddingLeft: "0px" }} icon={<Box />} component={<NavLink to="/banhang/order-management" />}>
                            Quản Lý Đơn Hàng
                        </MenuItem>
                        <MenuItem style={{ paddingLeft: "0px" }} icon={<Box />} component={<NavLink to="/banhang/payment-management" />}>
                            Quản Lý Hóa Đơn
                        </MenuItem>
                        <SubMenu label="Quản Lý Sản Phẩm " style={{ paddingLeft: "0px" }} icon={<BoxSeam />}>
                            <MenuItem style={{ paddingLeft: "15px" }} icon={<Box />} component={<NavLink to="/banhang/all-products" />}>
                                Tất Cả Sản Phẩm
                            </MenuItem>
                            <MenuItem style={{ paddingLeft: "15px" }} icon={<PlusCircle />} component={<NavLink to="/banhang/add-product" />}>
                                Thêm Sản Phẩm
                            </MenuItem>
                        </SubMenu>
                        <SubMenu label="Quản Lý Cửa Hàng " style={{ paddingLeft: "0px" }} icon={<BoxSeam />}>
                            <MenuItem style={{ paddingLeft: "15px" }} icon={<Box />} component={<NavLink to="/banhang/shop-profile" />}>
                                Hồ Sơ Shop
                            </MenuItem>
                            <MenuItem style={{ paddingLeft: "15px" }} icon={<PlusCircle />} component={<NavLink to="/banhang/shipping-fee-settings" />}>
                                Thiết Lập Tiền Ship
                            </MenuItem>
                        </SubMenu>
                    </Menu>
                </div>
            </Sidebar>
            <div className="flex flex-col flex-grow" style={{ marginLeft: collapsed ? '80px' : '250px', transition: 'margin-left 0.3s', width: 'calc(100% - ' + (collapsed ? '80px' : '250px') + ')' }}>
                <Header username="John Doe" avatarUrl="/path-to-avatar.jpg" />
                <main className="flex-grow p-8 bg-gray-100 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default SalerSidebar;
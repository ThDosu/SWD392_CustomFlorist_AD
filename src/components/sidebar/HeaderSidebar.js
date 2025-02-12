import React, { useState, useEffect } from 'react';
import { Navbar, NavDropdown, Dropdown } from 'react-bootstrap';
import { PersonCircle, Gear, BoxArrowRight } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import './HeaderSidebar.css';
import axios from 'axios';

const Header = ({ username, avatarUrl }) => {
    const [storeName, setStoreName] = useState('');
    const [storeAvatar, setStoreAvatar] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storeID = localStorage.getItem("storeID");

        if (token && storeID) {
            fetchStoreData(storeID);
        }

        setIsLoggedIn(!!token);
    }, []);

    const fetchStoreData = async (storeID) => {
        try {
            const response = await axios.get(`https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/store/store-management/get-by-id?storeID=${storeID}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );
            const storeData = response.data;
            setStoreName(storeData.storeName);
            setStoreAvatar(storeData.storeAvatar);
            console.log("Store data:", storeData);
        } catch (error) {
            console.error("Lỗi fetching store data:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        history.push("/login");
    };

    return (
        <Navbar bg="white" expand="lg" className="py-2 px-4 shadow-sm" style={{ height: '64px', width: '100%', maxWidth: '100%', marginBottom: '20px' }}>
            <div className="d-flex justify-content-between align-items-center w-100">
                <Navbar.Brand href="#home" className="d-flex align-items-center">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/bloom-gift-67f83.appspot.com/o/element-layout%2Flogo%2Ffavicon_48x48.png?alt=media&token=c8dc92cf-204b-43a6-8d21-6bc9677f027a"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="BloomGift logo"
                    />
                    <span className="ml-2">BloomGift</span>
                </Navbar.Brand>
                <div className="d-flex align-items-center">
                    <span className="mr-2">{storeName}</span>
                    <NavDropdown
                        title={
                            <div className="d-inline-block">
                                {storeAvatar ? (
                                    <img
                                        src={storeAvatar}
                                        width="32"
                                        height="32"
                                        className="rounded-circle"
                                        alt={storeName}
                                    />
                                ) : (
                                    <PersonCircle size={32} />
                                )}
                            </div>
                        }
                        id="basic-nav-dropdown"
                        show={showDropdown}
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                        align="end"
                    >
                        <Dropdown.Item href="shop-profile" className="d-flex align-items-center">
                            <PersonCircle className="mr-2" /> Hồ Sơ Shop
                        </Dropdown.Item>
                        <Dropdown.Item href="#settings" className="d-flex align-items-center">
                            <Gear className="mr-2" /> Thiết Lập Shop
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item href="#logout" className="d-flex align-items-center text-danger" onClick={handleLogout}>
                            <BoxArrowRight className="mr-2" /> Đăng xuất
                        </Dropdown.Item>
                    </NavDropdown>
                </div>
            </div>
        </Navbar>
    );
};

export default Header;
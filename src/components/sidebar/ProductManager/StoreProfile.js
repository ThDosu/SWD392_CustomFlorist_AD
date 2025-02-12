import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from "react-toast-notifications";
import Swal from 'sweetalert2';
import { fetchSellerInfo, updateSellerInfo } from '../../../redux/actions/storeActions';
import './StoreProfile.css';

const StoreProfile = () => {
    const dispatch = useDispatch();
    const sellerInfo = useSelector(state => state.seller.sellerInfo);
    const [activeTab, setActiveTab] = useState('Thông tin cơ bản');
    const { addToast } = useToasts();
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState({});
    const [storeAvatar, setStoreAvatar] = useState(null);

    useEffect(() => {
        const storeID = localStorage.getItem('storeID');
        dispatch(fetchSellerInfo(storeID));
    }, [dispatch]);

    useEffect(() => {
        if (sellerInfo) {
            setEditedInfo(sellerInfo);
        }
    }, [sellerInfo]);

    const handleInputChange = (field, value) => {
        setEditedInfo({
            ...editedInfo,
            [field]: value,
        });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setStoreAvatar(e.target.files[0]);
    };

    const handleSave = async () => {
        const storeID = localStorage.getItem('storeID');
        try {
            await dispatch(updateSellerInfo(storeID, editedInfo, storeAvatar)); // Pass avatar file
            await dispatch(fetchSellerInfo(storeID));
            addToast('Cập nhật thông tin thành công!', { appearance: 'success' });
            setIsEditing(false);
        } catch (error) {
            addToast('Cập nhật thông tin thất bại!', { appearance: 'error' });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedInfo(sellerInfo);
        setStoreAvatar(null); // Reset file input
    };

    const handleTabChange = (tab) => {
        if (isEditing) {
            Swal.fire({
                title: 'Xác nhận',
                text: 'Bạn chưa lưu thông tin đang sửa, những thông tin này sẽ không được lưu, bạn có chắc muốn rời trang này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
                confirmButtonColor: "#f02727",
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsEditing(false);
                    setActiveTab(tab);
                    setEditedInfo(sellerInfo);
                    setStoreAvatar(null);
                }
            });
        } else {
            setActiveTab(tab);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Thông tin cơ bản':
                return (
                    <div className="basic-info">
                        <h2>Thông tin cơ bản</h2>
                        <div className="info-row">
                            <span>Tên Shop:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.storeName || ''}
                                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.storeName || '0967630810phuc'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span>Logo của Shop:</span>
                            {isEditing ? (
                                <>
                                    <input
                                        type="file"
                                        onChange={handleFileChange} // Handle file upload
                                    />
                                    {storeAvatar && (
                                        <img
                                            src={URL.createObjectURL(storeAvatar)}
                                            alt="Preview"
                                            width="100"
                                            height="100"
                                            className="rounded-circle"
                                        />
                                    )}
                                </>
                            ) : (
                                sellerInfo?.storeAvatar ? (
                                    <img src={sellerInfo.storeAvatar} alt="Shop Logo" width="100" height="100" className="rounded-circle" />
                                ) : (
                                    <div className="default-logo">P</div>
                                )
                            )}
                        </div>
                        <div className="info-row">
                            <span>Mô tả Shop:</span>
                            {isEditing ? (
                                <textarea
                                    value={editedInfo.storeDescription || ''}
                                    onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                                />
                            ) : (
                                    <span>{sellerInfo?.storeDescription || ''}</span>
                            )}
                        </div>

                        <div className="info-row">
                            <span>Trạng thái Shop:</span>
                            {isEditing ? (
                                <select
                                    value={editedInfo.storeStatus || ''}
                                    onChange={(e) => handleInputChange('storeStatus', e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            ) : (
                                <span>{sellerInfo?.storeStatus || ''}</span>
                            )}
                        </div>
                    </div>
                );
            case 'Thông tin Thuế':
                return (
                    <div className="tax-info">
                        <h2>Thông tin Thuế</h2>
                        <div className="info-row">
                            <span>Email:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.email || 'N/A'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span>Địa chỉ:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.storeAddress || ''}
                                    onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.storeAddress || 'N/A'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span>Loại hình kinh doanh:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.type || ''}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.type || 'N/A'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span>Mã số thuế:</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.taxNumber || ''}
                                    onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.taxNumber || 'N/A'}</span>
                            )}
                        </div>
                    </div>
                );
            case 'Thông tin Khác':
                return (
                    <div className="other-info">
                        <h2>Thông tin Định Danh</h2>
                        <div className="info-row">
                            <span>CCCD: </span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.identityCard || ''}
                                    onChange={(e) => handleInputChange('identityCard', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.identityCard || 'N/A'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span>Tên CCCD: </span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.identityName || ''}
                                    onChange={(e) => handleInputChange('identityName', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.identityName || 'N/A'}</span>
                            )}
                        </div>
                        <h2>Thông tin Ngân Hàng</h2>
                        <div className="info-row">
                            <span>Tên ngân hàng: </span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.bankAccountName || ''}
                                    onChange={(e) => handleInputChange('bankAccountName', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.bankAccountName || 'N/A'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span>Số tài khoản: </span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.bankNumber || ''}
                                    onChange={(e) => handleInputChange('bankNumber', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.bankNumber || 'N/A'}</span>
                            )}
                        </div>
                        <div className="info-row">
                            <span>Địa chỉ ngân hàng: </span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedInfo.bankAddress || ''}
                                    onChange={(e) => handleInputChange('bankAddress', e.target.value)}
                                />
                            ) : (
                                <span>{sellerInfo?.bankAddress || 'N/A'}</span>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="store-profile">
            <div className="tab-header">
                {['Thông tin cơ bản', 'Thông tin Thuế', 'Thông tin Khác'].map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {renderTabContent()}
            </div>
            <div className="action-buttons">
                {isEditing ? (
                    <>
                        <button className="save" onClick={handleSave}>Lưu</button>
                        <button className="cancel" onClick={handleCancel}>Hủy</button>
                    </>
                ) : (
                    <>
                        <button className="view-shop">Xem Shop của tôi</button>
                        <button className="edit" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default StoreProfile;
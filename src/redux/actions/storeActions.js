import axios from "axios";

export const SELLER_INFO = "SELLER_INFO";
export const UPDATE_SELLER_INFO = "UPDATE_SELLER_INFO";
export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";

export const fetchSellerInfo = (sellerId) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const response = await axios.get('https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/store/store-management/get-by-id', {
                params: { storeID: sellerId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const storeData = response.data;
            dispatch({
                type: SELLER_INFO,
                payload: {
                    storeID: storeData.storeID,
                    storeName: storeData.storeName,
                    type: storeData.type.trim(),
                    storePhone: storeData.storePhone,
                    storeAddress: storeData.storeAddress,
                    email: storeData.email,
                    bankAccountName: storeData.bankAccountName,
                    bankNumber: storeData.bankNumber,
                    bankAddress: storeData.bankAddress,
                    taxNumber: storeData.taxNumber,
                    storeStatus: storeData.storeStatus,
                    storeAvatar: storeData.storeAvatar,
                    identityCard: storeData.identityCard.trim(),
                    identityName: storeData.identityName,
                    roleName: storeData.roleName,
                    storeDescription: storeData.storeDescription
                }
            });
            return storeData;
        } catch (error) {
            console.error("Fetch seller info failed:", error);
            return Promise.reject(error);
        }
    }
}

export const updateSellerInfo = (sellerId, editedInfo, storeAvatar) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            const sellerInfoForBackend = {
                storeName: editedInfo.storeName,
                type: editedInfo.type,
                storePhone: editedInfo.storePhone,
                storeAddress: editedInfo.storeAddress,
                email: editedInfo.email,
                bankAccountName: editedInfo.bankAccountName,
                bankNumber: editedInfo.bankNumber,
                bankAddress: editedInfo.bankAddress,
                taxNumber: editedInfo.taxNumber,
                identityCard: editedInfo.identityCard,
                identityName: editedInfo.identityName,
                storeStatus: editedInfo.storeStatus,
                storeDescription: editedInfo.storeDescription,
                password: editedInfo.password
            };

            // Prepare FormData for multipart request
            const formData = new FormData();
            formData.append("storePutRequest", JSON.stringify(sellerInfoForBackend));
            if (storeAvatar) {
                formData.append("storeAvatar", storeAvatar); // Attach file if exists
            }

            // Send the request with multipart data
            const response = await axios.put(
                `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/store/store-management/update/${sellerId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error(`Error updating store info: ${response.status}`);
            }

            const updatedStoreData = response.data;
            dispatch({
                type: UPDATE_SELLER_INFO,
                payload: updatedStoreData,
            });
            return updatedStoreData;
        } catch (error) {
            console.error("Update store info failed:", error);
            return Promise.reject(error);
        }
    };
}

export const fetchCountAccount = async () => {
    try {
        const response = await axios.get(`https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/admin/role-management/customer-count`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error("Fetch account count failed:", error);
        return Promise.reject(error);
    }
};

export const fetchCountStoresByStatus = async () => {
    const storeStatus = "Đã kích hoạt";
    try {
        const encodedStatus = encodeURIComponent(storeStatus);
        const response = await axios.get(`https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/admin/role-management/seller-count?storeStatus=${encodedStatus}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
        }

        return response.data;
    } catch (error) {
        console.error("Fetch store count failed:", error);
        return Promise.reject(error);
    }
};

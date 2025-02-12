import axios from "axios";

export const GET_DISTANSE_FEE_BY_STORE = "GET_DISTANSE_FEE_BY_STORE";
export const CREATE_DISTANSE_FEE = "CREATE_DISTANSE_FEE";
export const UPDATE_DISTANSE_FEE = "UPDATE_DISTANSE_FEE";

export const fetchDistanseFeeByStore = (storeID) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const response = await axios.get(`https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/distanceFee/${storeID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const distanseFeeData = response.data;
            dispatch({
                type: GET_DISTANSE_FEE_BY_STORE,
                payload: distanseFeeData
            });
            return distanseFeeData;
        } catch (error) {
            console.error("Fetch distanse fee info failed:", error);
            return Promise.reject(error);
        }
    }
}

// Thêm action để cập nhật phí khoảng cách
export const updateDistanseFee = (storeID, fee, range) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const response = await axios.put(`https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/distanceFee/update`, {
                storeID,
                fee,
                range
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 200) {
                throw new Error(`Lỗi khi cập nhật dữ liệu: ${response.status}`);
            }

            dispatch({
                type: UPDATE_DISTANSE_FEE,
                payload: response.data
            });
            return response.data;
        } catch (error) {
            console.error("Update distanse fee failed:", error);
            return Promise.reject(error);
        }
    }
}

export const createDistanseFee = (storeID, fee, range) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const response = await axios.post(`https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/distanceFee/create`, {
                storeID,
                fee,
                range
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status !== 200) {
                throw new Error(`Lỗi khi tạo dữ liệu: ${response.status}`);
            }

            dispatch({
                type: CREATE_DISTANSE_FEE,
                payload: response.data
            });
            return response.data;
        } catch (error) {
            console.error("Create distanse fee failed:", error);
            return Promise.reject(error);
        }
    }
}
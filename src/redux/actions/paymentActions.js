import axios from "axios";

export const GET_PAYMENT_BY_STORE = "GET_PAYMENT_BY_STORE";

export const fetchPaymentByStore = (storeID) => {
    return async (dispatch) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }
            const response = await axios.get(`https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/payment/get-payment-by-store-id/${storeID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 200) {
                throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
            }
            const paymentData = response.data;
            dispatch({
                type: GET_PAYMENT_BY_STORE,
                payload: paymentData
            });
            return paymentData;
        } catch (error) {
            console.error("Fetch payment info failed:", error);
            return Promise.reject(error);
        }
    }
}
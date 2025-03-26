import axios from "axios";
import config from "../../constants/config";

export const GET_PAYMENT_BY_STORE = "GET_PAYMENT_BY_STORE";

export const fetchAllPayment = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`${config.baseUrl}payment?page=0&size=50&direction=ASC`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const paymentData = response.data.data.content;

      console.log("paymentData", paymentData);

      dispatch({
        type: GET_PAYMENT_BY_STORE,
        payload: paymentData,
      });
      return paymentData;
    } catch (error) {
      console.error("Fetch payment info failed:", error);
      return Promise.reject(error);
    }
  };
};

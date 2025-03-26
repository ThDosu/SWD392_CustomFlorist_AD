import axios from "axios";

export const GET_REVENUES_COUNT_BY_STORE = "GET_REVENUES_COUNT_BY_STORE";
export const GET_PLACED_ORDERS_COUNT = "GET_PLACED_ORDERS_COUNT";
export const GET_RECEIVED_REVENUE_BY_STORE = "GET_RECEIVED_REVENUE_BY_STORE";
export const GET_TOTAL_PRODUCTS_BY_STORE = "GET_TOTAL_PRODUCTS_BY_STORE";
export const GET_TOTAL_ORDERS_BY_STORE_IN_TIME = "GET_TOTAL_ORDERS_BY_STORE-IN_TIME";
export const GET_TOTAL_PAYMENT_BY_STORE_IN_TIME = "GET_TOTAL_PAYMENT_BY_STORE-IN_TIME";
export const GET_TOTAL_PRODUCT_BY_STORE_IN_TIME = "GET_TOTAL_PRODUCT_BY_STORE_IN_TIME";

export const fetchRevenuesCountByStore = (storeID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/payment/total-price`,
        {
          params: { storeID },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const revenuesData = response.data;
      dispatch({
        type: GET_REVENUES_COUNT_BY_STORE,
        payload: revenuesData,
      });
      return revenuesData;
    } catch (error) {
      console.error("Fetch revenues count failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchPlacedOrdersCount = (storeID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/order/order-management/placed-orders-count/${storeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const placedOrdersData = response.data;
      dispatch({
        type: GET_PLACED_ORDERS_COUNT,
        payload: placedOrdersData,
      });
      return placedOrdersData;
    } catch (error) {
      console.error("Fetch placed orders count failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchReceivedRevenueByStore = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`http://localhost:8080/custom-florist/api/v1/statistic/monthly-statistics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const receivedRevenueData = response.data.data;
      console.log("receivedRevenueData", receivedRevenueData);

      dispatch({
        type: GET_RECEIVED_REVENUE_BY_STORE,
        payload: receivedRevenueData,
      });
      return receivedRevenueData;
    } catch (error) {
      console.error("Fetch received revenue failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchTotalProductsByStore = (storeID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/count-by-store/${storeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const totalProductsData = response.data;
      dispatch({
        type: GET_TOTAL_PRODUCTS_BY_STORE,
        payload: totalProductsData,
      });
      return totalProductsData;
    } catch (error) {
      console.error("Fetch total products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchTotalProductByStoreInTime = (storeID, startDate, endDate) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams({
        storeID: storeID,
        startDate: startDate,
        endDate: endDate,
      }).toString();

      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/count-by-store-and-date-range?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      const totalProductData = response.data;

      dispatch({
        type: GET_TOTAL_PRODUCT_BY_STORE_IN_TIME,
        payload: totalProductData,
      });

      return totalProductData;
    } catch (error) {
      console.error("Fetch total products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchTotalOrdersByStoreInTime = (storeID, startDate, endDate) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams({
        storeID: storeID,
        startDate: startDate,
        endDate: endDate,
      }).toString();

      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/order/order-management/count-by-store-and-date-range?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      const totalOrdersData = response.data;

      dispatch({
        type: GET_TOTAL_ORDERS_BY_STORE_IN_TIME,
        payload: totalOrdersData,
      });

      return totalOrdersData;
    } catch (error) {
      console.error("Fetch total orders failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchTotalPaymentByStoreInTime = (storeID, startDate, endDate) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams({
        storeID: storeID,
        startDate: startDate,
        endDate: endDate,
      }).toString();

      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/payment/count-by-store-and-date-range?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      const totalPaymentData = response.data;

      dispatch({
        type: GET_TOTAL_PAYMENT_BY_STORE_IN_TIME,
        payload: totalPaymentData,
      });

      return totalPaymentData;
    } catch (error) {
      console.error("Fetch total payment failed:", error);
      return Promise.reject(error);
    }
  };
};

import axios from "axios";

export const GET_ALL_ORDERS = "GET_ALL_ORDERS";
export const GET_ORDER_BY_ID = "GET_ORDER_BY_ID";
export const GET_ORDER_BY_STATUS = "GET_ORDER_BY_STATUS";
export const GET_ORDER_COUNT_REVENUE = "GET_ORDER_COUNT_REVENUE";

export const fetchAllOrdersByStoreID = (storeID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      console.log("token orderActions", token);

      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `http://localhost:8080/custom-florist/api/v1/orders?userId=4&page=0&size=50&direction=ASC
`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const orders = response.data;
      dispatch({
        type: GET_ALL_ORDERS,
        payload: orders,
      });
      return orders;
    } catch (error) {
      console.error("Fetch orders failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchCountPlacedOrdersByStoreID = (storeID) => {
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
      const count = response.data;
      return count;
    } catch (error) {
      console.error("Fetch count placed orders failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchOrderById = (orderID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`http://localhost:8080/custom-florist/api/v1/orders/${orderID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const order = response.data;
      dispatch({
        type: GET_ORDER_BY_ID,
        payload: order,
      });
      return order;
    } catch (error) {
      console.error("Fetch order by ID failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchOrderByStatus = (orderStatus) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/order/order-management/get-order-by-status/${orderStatus}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const orders = response.data;
      dispatch({
        type: GET_ORDER_BY_STATUS,
        payload: orders,
      });
      return orders;
    } catch (error) {
      console.error("Fetch order by status failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchOrderCountRevenue = async () => {
  try {
    const response = await axios.get(
      `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/admin/payment/revenue-count`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

export const acceptOrder = (orderID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.put(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/order/order-management/accept-order/${orderID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const order = response.data;
      return order;
    } catch (error) {
      console.error("Accept order failed:", error);
      return Promise.reject(error);
    }
  };
};

export const completedOrder = (orderID) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.put(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/order/order-management/done-and-shipping-order/${orderID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const order = response.data;
      return order;
    } catch (error) {
      console.error("Complete order failed:", error);
      return Promise.reject(error);
    }
  };
};

export const rejectOrder = (orderID, note) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.put(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/order/order-management/reject-order/${orderID}`,
        null,
        {
          params: { note },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const order = response.data;
      return order;
    } catch (error) {
      console.error("Reject order failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchStoresCount = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams({
        startDate: startDate,
        endDate: endDate,
      }).toString();

      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/admin/store-management/stores-count/range?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      const storesCount = response.data;

      dispatch({
        type: "GET_STORES_COUNT",
        payload: storesCount,
      });

      return storesCount;
    } catch (error) {
      console.error("Fetch stores count failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchCustomersCount = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams({
        startDate: startDate,
        endDate: endDate,
      }).toString();

      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/admin/accounts-management/accounts-count/range?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      const storesCount = response.data;

      dispatch({
        type: "GET_STORES_COUNT",
        payload: storesCount,
      });

      return storesCount;
    } catch (error) {
      console.error("Fetch stores count failed:", error);
      return Promise.reject(error);
    }
  };
};

export const fetchtRevenuesCount = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams({
        startDate: startDate,
        endDate: endDate,
      }).toString();

      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/admin/payment/payments-count/range?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }

      const storesCount = response.data;

      dispatch({
        type: "GET_REVENUES_COUNT",
        payload: storesCount,
      });

      return storesCount;
    } catch (error) {
      console.error("Fetch revenue count failed:", error);
      return Promise.reject(error);
    }
  };
};

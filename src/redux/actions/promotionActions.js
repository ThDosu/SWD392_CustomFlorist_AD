import { Content } from "antd/es/layout/layout";
import axios from "axios";
import config from "../../constants/config";

export const GET_ALL_PROMOTIONS = "GET_ALL_PROMOTIONS";
export const GET_PROMOTION_BY_ID = "GET_PROMOTION_BY_ID";
export const GET_PROMOTION_BY_STATUS = "GET_PROMOTION_BY_STATUS";
export const CREATE_PROMOTION = "CREATE_PROMOTION";
export const UPDATE_PROMOTION = "UPDATE_PROMOTION";
export const DELETE_PROMOTION = "DELETE_PROMOTION";
export const SET_PROMOTION_ERROR = "SET_PROMOTION_ERROR";

export const getAllPromotions = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${config.baseUrl}promotions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      console.log("response", response.data);

      const promotions = response.data;

      dispatch({
        type: GET_ALL_PROMOTIONS,
        payload: promotions,
      });
      return promotions;
    } catch (error) {
      console.error("Fetch all promotions failed:", error);
      return Promise.reject(error);
    }
  };
};

export const getPromotionByStatus = (promotionStatus) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/seller/promotions/promotion-management/get-by-promotion-status/${promotionStatus}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const promotions = response.data;
      if (promotions.message === "Không tìm thấy khuyến mãi với trạng thái này") {
        dispatch({
          type: SET_PROMOTION_ERROR,
          payload: "Không tìm thấy mã giảm giá",
        });
      } else {
        dispatch({
          type: GET_PROMOTION_BY_STATUS,
          payload: promotions,
        });
      }
      return promotions;
    } catch (error) {
      console.error("Fetch promotions by status failed:", error);
      dispatch({
        type: SET_PROMOTION_ERROR,
        payload: "Không tìm thấy khuyến mãi với trạng thái này.",
      });
      return Promise.reject(error);
    }
  };
};

export const getPromotionById = (promotionID) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${config.baseUrl}promotions/${promotionID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const promotion = response.data;
      dispatch({
        type: GET_PROMOTION_BY_ID,
        payload: promotion,
      });
      return promotion;
    } catch (error) {
      console.error("Fetch promotion by id failed:", error);
      return Promise.reject(error);
    }
  };
};
export const createPromotion = (promotionInfo) => {
  return async (dispatch) => {
    try {
      console.log("promotionInfoCreate", promotionInfo);

      const response = await axios.post(`${config.baseUrl}promotions`, promotionInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status !== 201) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const promotion = response.data;
      dispatch({
        type: CREATE_PROMOTION,
        payload: promotion,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const updatePromotion = (promotionID, promotionInfo) => {
  console.log("promotionInfo", promotionInfo);

  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${config.baseUrl}promotions/${promotionID}`, promotionInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const promotion = response.data;
      dispatch({
        type: UPDATE_PROMOTION,
        payload: promotion,
      });
      return promotion;
    } catch (error) {
      console.error("Update promotion failed:", error);
      return Promise.reject(error);
    }
  };
};

export const deletePromotion = (promotionID) => {
  console.log("Delete", promotionID);

  return async (dispatch) => {
    try {
      const response = await axios.delete(`${config.baseUrl}promotions/${promotionID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status !== 204) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      dispatch({
        type: DELETE_PROMOTION,
        payload: promotionID,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

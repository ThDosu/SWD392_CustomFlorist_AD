import axios from "axios";

export const GET_ALL_PRODUCTS = "GET_ALL_PRODUCTS";
export const GET_PRODUCTS_BY_ID = "GET_PRODUCTS_BY_ID";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const CREATE_PRODUCT_SUCCESS = "CREATE_PRODUCT_SUCCESS";
export const CREATE_PRODUCT_FAILURE = "CREATE_PRODUCT_FAILURE";
export const UPDATE_PRODUCT_SUCCESS = "UPDATE_PRODUCT_SUCCESS";
export const UPDATE_PRODUCT_FAILURE = "UPDATE_PRODUCT_FAILURE";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAILURE = "DELETE_PRODUCT_FAILURE";
export const GET_PRODUCTS_BY_STOREID = "GET_PRODUCTS_BY_STOREID";
export const GET_PRODUCTS_BY_STOREID_WITH_STATUS = "GET_PRODUCTS_BY_STOREID_WITH_STATUS";
export const GET_PRODUCTS_BY_STOREID_BY_SELLER = "GET_PRODUCTS_BY_STOREID_BY_SELLER";

const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

// Create product success action
const createProductSuccess = (message) => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: message,
});

// Create product failure action
const createProductFailure = (error) => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: error,
});

// fetch products
export const fetchProducts = (products) => {
  return (dispatch) => {
    dispatch(fetchProductsSuccess(products));
  };
};

export const getAllProducts = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        "https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/get-all"
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const products = response.data;
      dispatch({
        type: GET_ALL_PRODUCTS,
        payload: products,
      });
      console.log(products);
      return products;
    } catch (error) {
      console.error("Fetch all products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const getProductByStatusTrue = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        "https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/products/status?productStatus=true"
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const products = response.data;
      dispatch({
        type: GET_ALL_PRODUCTS,
        payload: products,
      });
      return products;
    } catch (error) {
      console.error("Fetch all products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const getProductByStatusFalse = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        "https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/products/status?productStatus=false"
      );
      if (response.status !== 200) {
        throw new Error(`Lỗi khi nhận dữ liệu: ${response.status}`);
      }
      const products = response.data;
      dispatch({
        type: GET_ALL_PRODUCTS,
        payload: products,
      });
      return products;
    } catch (error) {
      console.error("Fetch all products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const createProduct = (productRequest, imageFiles) => {
  return async (dispatch) => {
    try {
      // Tạo FormData để đính kèm JSON và file ảnh
      const formData = new FormData();

      // Thêm productRequest dưới dạng JSON string
      formData.append("productRequest", JSON.stringify(productRequest));

      imageFiles.forEach((file) => {
        formData.append("imageFiles", file);
      });

      const response = await axios.post(
        "https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        dispatch(createProductSuccess("Product created successfully"));
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      console.error("Create product failed:", error);
      dispatch(createProductFailure(error.message));
      return Promise.reject(error);
    }
  };
};

export const updateProduct = (productID, productRequest, imageFiles) => {
  return async (dispatch) => {
    try {
      // Tạo FormData để đính kèm JSON và file ảnh
      const formData = new FormData();

      // Thêm productRequest dưới dạng JSON string
      formData.append("productRequest", JSON.stringify(productRequest));

      imageFiles.forEach((file) => {
        formData.append("imageFiles", file);
      });

      const response = await axios.put(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/update-product/${productID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        dispatch({
          type: UPDATE_PRODUCT_SUCCESS,
          payload: "Product updated successfully",
        });
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Update product failed:", error);
      dispatch({
        type: UPDATE_PRODUCT_FAILURE,
        payload: error.message,
      });
      return Promise.reject(error);
    }
  };
};

export const getProductByID = (productID) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/${productID}`
      );
      if (response.status === 200) {
        const product = response.data;
        dispatch({
          type: GET_PRODUCTS_BY_ID,
          payload: product,
        });
        return product;
      }
      throw new Error("Failed to get product");
    } catch (error) {
      console.error("Get product failed:", error);
      return Promise.reject(error);
    }
  };
};

export const deleteProduct = (productID) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/delete-product/${productID}`
      );
      if (response.status === 200) {
        dispatch({
          type: DELETE_PRODUCT_SUCCESS,
          payload: "Product deleted successfully",
        });
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete product failed:", error);
      dispatch({
        type: DELETE_PRODUCT_FAILURE,
        payload: error.message,
      });
      return Promise.reject(error);
    }
  };
};

export const getProductsByStoreID = (storeID) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/products/store/${storeID}`
      );
      if (response.status === 200) {
        const products = response.data;
        dispatch({
          type: GET_PRODUCTS_BY_STOREID,
          payload: products,
        });
        return products;
      }
      throw new Error("Failed to get products");
    } catch (error) {
      console.error("Get products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const deleteProductImage = (productID, imageID) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/delete-image/${imageID}?productID=${productID}`
      );
      if (response.status === 200) {
        dispatch({
          type: DELETE_PRODUCT_SUCCESS,
          payload: "Image deleted successfully",
        });
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete image failed:", error);
      dispatch({
        type: DELETE_PRODUCT_FAILURE,
        payload: error.message,
      });
      return Promise.reject(error);
    }
  };
};

export const getProductsByStoreIDBySeller = (page = 0) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:8080/custom-florist/api/v1/categories?page=${page}&size=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        const products = response.data.content;
        dispatch({
          type: GET_PRODUCTS_BY_STOREID_BY_SELLER,
          payload: products,
        });
        return products;
      }
      throw new Error("Failed to get products");
    } catch (error) {
      console.error("Get products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const getProductsByStoreIDWithStatusTrue = (storeID, productStatus) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/get-product-by-store-and-status/${storeID}/true`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        const products = response.data;
        dispatch({
          type: GET_PRODUCTS_BY_STOREID_WITH_STATUS,
          payload: products,
        });
        return products;
      }
      throw new Error("Failed to get products");
    } catch (error) {
      console.error("Get products failed:", error);
      return Promise.reject(error);
    }
  };
};

export const getProductsByStoreIDWithStatusFalse = (storeID, productStatus) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `https://bloomgift2-hkdra9cyapase2cy.southeastasia-01.azurewebsites.net/api/product/get-product-by-store-and-status/${storeID}/false`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        const products = response.data;
        dispatch({
          type: GET_PRODUCTS_BY_STOREID_WITH_STATUS,
          payload: products,
        });
        return products;
      }
      throw new Error("Failed to get products");
    } catch (error) {
      console.error("Get products failed:", error);
      return Promise.reject(error);
    }
  };
};

import {
  FETCH_PRODUCTS_SUCCESS,
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_ID,
  UPDATE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_SUCCESS,
  GET_PRODUCTS_BY_STOREID_BY_SELLER,
  GET_PRODUCTS_BY_STOREID_WITH_STATUS,
} from "../actions/productActions";

const initState = {
  products: null,
  catelories: null,
  selectedProduct: null,
  selectedCategory: null,
  isAuthorized: false,
  loading: false,
  error: null,
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };
    case GET_ALL_PRODUCTS:
      console.log("Reducer action received:", action.payload); // Kiểm tra dữ liệu trước khi cập nhật state

      return {
        ...state,
        catelories: action.payload,
        loading: false,
        error: null,
      };
    case GET_PRODUCTS_BY_ID:
      return {
        ...state,
        selectedCategory: action.payload,
        loading: false,
        error: null,
      };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        selectedProduct: action.payload,
        isAuthorized: true,
        loading: false,
        error: null,
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        selectedProduct: action.payload,
        isAuthorized: true,
        loading: false,
        error: null,
      };
    case GET_PRODUCTS_BY_STOREID_BY_SELLER:
      return {
        ...state,
        products: action.payload,
        isAuthorized: true,
        loading: false,
        error: null,
      };
    case GET_PRODUCTS_BY_STOREID_WITH_STATUS:
      return {
        ...state,
        products: action.payload,
        isAuthorized: true,
        loading: false,
        error: null,
      };
    default:
      break;
  }

  return state;
};

export default productReducer;

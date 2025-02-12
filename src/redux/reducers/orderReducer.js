import { GET_ALL_ORDERS, GET_ORDER_BY_ID, GET_ORDER_BY_STATUS, REJECT_ORDER } from "../actions/orderActions";

const initState = {
    orders: null,
    selectedOrder: null,
    isAuthorized: false,
    loading: false,
    error: null
};

const orderReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_ALL_ORDERS:
            return {
                ...state,
                orders: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        case GET_ORDER_BY_ID:
            return {
                ...state,
                selectedOrder: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        case GET_ORDER_BY_STATUS:
            return {
                ...state,
                orders: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

export default orderReducer;
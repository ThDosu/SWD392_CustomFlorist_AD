import {
    GET_REVENUES_COUNT_BY_STORE,
    GET_PLACED_ORDERS_COUNT,
    GET_RECEIVED_REVENUE_BY_STORE,
    GET_TOTAL_ORDERS_BY_STORE_IN_TIME,
    GET_TOTAL_PAYMENT_BY_STORE_IN_TIME,
    GET_TOTAL_PRODUCT_BY_STORE_IN_TIME
} from "../actions/revenueActions";

const initState = {
    revenues: null,
    placedOrdersCount: null,
    receivedRevenue: null,
    totalOrdersInTime: null,
    totalPaymentInTime: null,
    totalProductsInTime: null,
    loading: false,
    error: null
};

const revenueReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_REVENUES_COUNT_BY_STORE:
            return {
                ...state,
                revenues: action.payload,
                loading: false,
                error: null,
            };
        case GET_PLACED_ORDERS_COUNT:
            return {
                ...state,
                placedOrdersCount: action.payload,
                loading: false,
                error: null,
            };
        case GET_RECEIVED_REVENUE_BY_STORE:
            return {
                ...state,
                receivedRevenue: action.payload,
                loading: false,
                error: null,
            };
        case GET_TOTAL_ORDERS_BY_STORE_IN_TIME:
            return {
                ...state,
                totalOrdersInTime: action.payload,
                loading: false,
                error: null,
            };
        case GET_TOTAL_PAYMENT_BY_STORE_IN_TIME:
            return {
                ...state,
                totalPaymentInTime: action.payload,
                loading: false,
                error: null,
            };
        case GET_TOTAL_PRODUCT_BY_STORE_IN_TIME:
            return {
                ...state,
                totalProductsInTime: action.payload,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

export default revenueReducer;
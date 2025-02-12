import { GET_PAYMENT_BY_STORE } from "../actions/paymentActions";

const initState = {
    payments: null,
    loading: false,
    error: null,
    isAuthorized: false,
    selectedPayment: null
};

const paymentReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_PAYMENT_BY_STORE:
            return {
                ...state,
                payments: action.payload,
                isAuthorized: true,
                loading: false,
                error: null
            };
        default:
            return state;
    }
};

export default paymentReducer;
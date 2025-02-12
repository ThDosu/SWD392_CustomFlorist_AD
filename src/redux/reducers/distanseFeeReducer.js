import { GET_DISTANSE_FEE_BY_STORE, UPDATE_DISTANSE_FEE, CREATE_DISTANSE_FEE } from "../actions/distanseFeeActions";

const initState = {
    distanseFee: null,
    loading: false,
    error: null,
    isAuthorized: false,
    selectedDistanseFee: null
};

const distanseFeeReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_DISTANSE_FEE_BY_STORE:
            return {
                ...state,
                distanseFee: action.payload,
                loading: false,
                error: null,
            };
        case UPDATE_DISTANSE_FEE:
            return {
                ...state,
                distanseFee: action.payload, 
                loading: false,
                error: null,
            };
        case CREATE_DISTANSE_FEE:
            return {
                ...state,
                distanseFee: action.payload,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

export default distanseFeeReducer;
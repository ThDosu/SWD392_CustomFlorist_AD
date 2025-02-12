import { GET_ALL_PROMOTIONS, GET_PROMOTION_BY_STATUS, SET_PROMOTION_ERROR, UPDATE_PROMOTION, GET_PROMOTION_BY_ID } from "../actions/promotionActions";

const initState = {
    promotions: null,
    selectedPromotion: null,
    isAuthorized: false,
    loading: false,
    error: null
};

const promotionReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_ALL_PROMOTIONS:
            return {
                ...state,
                promotions: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        case GET_PROMOTION_BY_STATUS:
            return {
                ...state,
                promotions: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        case SET_PROMOTION_ERROR:
            return {
                ...state,
                promotions: [],
                isAuthorized: true,
                loading: false,
                error: action.payload,
            };
        case GET_PROMOTION_BY_ID:
            return {
                ...state,
                selectedPromotion: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        case UPDATE_PROMOTION:
            return {
                ...state,
                selectedPromotion: action.payload,
                isAuthorized: true,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

export default promotionReducer;
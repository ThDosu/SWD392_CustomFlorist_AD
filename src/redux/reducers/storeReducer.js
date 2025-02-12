import { produce } from 'immer';
import { SELLER_INFO, UPDATE_SELLER_INFO } from "../actions/storeActions";

const initialState = {
    sellerInfo: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const storeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SELLER_INFO:
            return {
                ...state,
                sellerInfo: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case UPDATE_SELLER_INFO:
            return {
                ...state,
                sellerInfo: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

export default storeReducer;
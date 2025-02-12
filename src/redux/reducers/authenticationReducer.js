import {
    REGISTER,
    LOGIN,
    VERIFY_ACCOUNT,
    FORGOT_PASSWORD,
    RESET_PASSWORD
} from "../actions/authenticationAction";
const initialState = {
    user: null,
    token: null, 
    isAuthenticated: false,
    loading: false,
    error: null,
  };
  
  const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN:
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token, 
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      case REGISTER:
        return {
          ...state,
          user: action.payload.user,
          isAuthenticated: false,
          loading: false,
          error: null,
        };
      case VERIFY_ACCOUNT:
        return {
          ...state,
          user: action.payload.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        };
      case FORGOT_PASSWORD:
        return {
          ...state,
          user: action.payload.user,
          isAuthenticated: false,
          loading: false,
          error: null,
        };
      case RESET_PASSWORD:
        return {
          ...state,
          user: action.payload.user,
          isAuthenticated: false,
          loading: false,
          error: null,
        };
      default:
        return state;
    }
  };
  
export default authenticationReducer;
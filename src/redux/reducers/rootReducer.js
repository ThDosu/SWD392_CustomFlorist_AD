import currencyReducer from "./currencyReducer";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import wishlistReducer from "./wishlistReducer";
import compareReducer from "./compareReducer";
import storeReducer from "./storeReducer";
import orderReducer from "./orderReducer";
import promotionReducer from "./promotionReducer";
import paymentReducer from "./paymentReducer";
import distanseFeeReducer from "./distanseFeeReducer";
import { combineReducers } from "redux";
import { createMultilanguageReducer } from "redux-multilanguage";

const rootReducer = combineReducers({
  multilanguage: createMultilanguageReducer({ currentLanguageCode: "en" }),
  currencyData: currencyReducer,
  productData: productReducer,
  cartData: cartReducer,
  wishlistData: wishlistReducer,
  orders: orderReducer,
  distanseFeeData: distanseFeeReducer,
  compareData: compareReducer,
  seller: storeReducer,
  promotionData: promotionReducer,
  paymentData: paymentReducer
});

export default rootReducer;

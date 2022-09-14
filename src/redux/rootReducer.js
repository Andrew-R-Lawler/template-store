import { combineReducers } from "redux";
import paymentReducer from "./paymentReducer";


const rootReducer = combineReducers({
    paymentReducer,
});

export default rootReducer;
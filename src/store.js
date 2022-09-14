import { configureStore } from "@reduxjs/toolkit";
import paymentSlice from "./redux/payment-api-slice";

export default configureStore({
  reducer: {
    payment: paymentSlice,
  }
});

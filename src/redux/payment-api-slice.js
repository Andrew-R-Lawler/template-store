import { createSlice } from '@reduxjs/toolkit';
const axios = require("axios");
const API_URL = "http://localhost:5000/api/payment";

export const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        data: []
    },
    reducers: {
        addPayment: (state, action) => {
            state.data = [action.payload]
        }
    }
});

export const addPaymentAsync = (data) => async (dispatch) => {
    try {
        console.log(data);
        const response = await axios.post(API_URL, data);
        console.log(response);
        dispatch(addPayment(response.data));
    } catch (err) {
        throw new Error(err);
    }
};

export const { addPayment } = paymentSlice.actions;
export const showPayment = (state) => state.payment.data;
export default paymentSlice.reducer;



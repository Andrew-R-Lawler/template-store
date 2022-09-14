const paymentReducer = (state = [], action) => {
    switch (action.type) {
        case "GET_PAYMENT_SECRET":
            return action.payload;
        default: return state;
    }
}

export default paymentReducer;

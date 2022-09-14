import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };

function* postPaymentIntent (action) {
    try{
        console.log('action.payload', action.payload);
        yield axios.post('http://localhost:5000/api/payment', {subtotal: 1000}, axiosConfig)
        yield put ({ type: 'GET_PAYMENT_SECRET' });

    } catch (error) {
        console.log('ERROR POST /payment', error)
    }
}

function* paymentSaga() {
    yield takeEvery('GET_PAYMENT_SECRET', postPaymentIntent)
}

export default paymentSaga;
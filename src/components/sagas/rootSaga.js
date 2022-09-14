import { all } from 'redux-saga/effects';
import paymentSaga from './paymentSaga';

export default function* rootSaga() {
    yield all([
        paymentSaga(),
    ]);
}
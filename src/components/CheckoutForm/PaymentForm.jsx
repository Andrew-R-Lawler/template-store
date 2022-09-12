import React, { useEffect, useState } from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, PaymentElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Checkout/Review';

const PaymentForm = ({ checkoutToken, backStep, shippingData, onCaptureCheckout, nextStep, paymentIntent }) => {
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const paymentElement = elements.getElement(PaymentElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: paymentElement });

    if (error) {
        console.log('[error]', error)
    } else {
        const orderData = {
            line_items: checkoutToken.line_items,
            customer: {
                firstname: shippingData.firstName,
                lastname: shippingData.lastName, 
                email: shippingData.email,
            },
            shipping: {
                name : 'Primary', 
                street: shippingData.address1, 
                town_city: shippingData.city, 
                county_state: shippingData.shippingSubdivision, 
                postal_zip_code: shippingData.zip, 
                country: shippingData.shippingCountry,
            },
            fulfillment: { shipping_method: shippingData.shippingOption },
            payment: {
                card: {
                    token: checkoutToken.id,
                },
                gateway: 'stripe',
                stripe: {
                    payment_method_id: paymentMethod.id,
                },
            },
        };
        onCaptureCheckout(checkoutToken.id, orderData);
        nextStep();
    }
    return (
    <>
        <Review checkoutToken={checkoutToken}/>
        <Divider />
        <Typography variant="h6" gutterBottom style={{ margin: '20px 0'}}>Payment method</Typography>
        <Elements stripe={stripePromise}>
        <ElementsConsumer>{({ elements, stripe }) => (
          <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
            <PaymentElement paymentIntent={paymentIntent} />
            <br /> <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" onClick={backStep}>Back</Button>
              <Button type="submit" variant="contained" disabled={!stripe} color="primary">
                Pay {checkoutToken.subtotal.formatted_with_symbol}
              </Button>
            </div>
          </form>
        )}
        </ElementsConsumer>
      </Elements>
    </>
  )
}
};

export default PaymentForm;
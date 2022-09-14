import React, { useState, useEffect } from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, PaymentElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Checkout/Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ checkoutToken, nextStep, backStep, shippingData, onCaptureCheckout }) => {

    const [paymentIntent, setPaymentIntent] = useState('');
    const [paymentId, setPaymentId] = useState('');


    
    const options = {
        // passing the client secret obtained in step 2
        clientSecret: paymentIntent,
    };

    const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const paymentElement = elements.getElement(PaymentElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: paymentElement });

    if (error) {
      console.log('[error]', error);
    } else {
      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        shipping: { name: 'International', street: shippingData.address1, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };
      onCaptureCheckout(checkoutToken.id, orderData);
      nextStep();
    };
  };


  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
      <Elements stripe={stripePromise} options={options}>
            <form>
                <PaymentElement />
                <Button>Submit</Button>
            </form>
      </Elements>
    </>
  );
};



export default PaymentForm;
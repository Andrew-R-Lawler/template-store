import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import NewCheckoutForm from '../NewCheckoutForm';
import { commerce } from '../../../lib/commerce';
import axios from 'axios';
import Review from './Review';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const steps = ['Shipping Address', 'Payment Details']
let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [paymentIntent, setPaymentIntent] = useState('');
    const classes = useStyles();
    const options = {
        // passing the client secret obtained in step 2
        clientSecret: paymentIntent,
    };
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    
    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                setCheckoutToken(token);
            } catch (error) {

            }
        }
        generateToken();
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    const Confirmation = () => (
        <div>
            Confirmation
        </div>
    )

    const fetchPaymentIntent = async (checkoutToken) => {
        const newPaymentIntent = await axios.post('http://localhost:5000/api/payment', {subtotal: checkoutToken.subtotal.raw}, axiosConfig);
        setPaymentIntent(newPaymentIntent.data.paymentIntent);
        };



    useEffect(() => {
        fetchPaymentIntent(checkoutToken);
    },[]);

    const Form = () => (activeStep === 0)
        ? <AddressForm cart={cart} checkoutToken={checkoutToken} next={next}/>
        : <><Elements stripe={stripePromise} options={options}><Review checkoutToken={checkoutToken} /><Divider /><NewCheckoutForm /></Elements></>;

  return (
    <>
        <div className={classes.toolbar} />
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant="h4" align="center">Checkout</Typography>
                <Stepper activeStep={activeStep} className={classes.stepper}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.legnth ? <Confirmation /> : checkoutToken && <Form />}
            </Paper>
        </main>
    </>
  )
}

export default Checkout
import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';

const steps = ['Shipping Address', 'Payment Details']

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [paymentIntent, setPaymentIntent] = useState({});
    const classes = useStyles();

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
        const newPaymentIntent = await fetch('http://localhost:5000/api/payment', {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify({ subtotal: checkoutToken.subtotal.raw }), // The data
            headers: {
                'Content-type': 'application/json' // The type of data you're sending
            },
        }).then(res => {
            if (res.status !== 200) {
                console.log("error")
                console.log(res)
            } else {
                setPaymentIntent(newPaymentIntent);
                console.log(newPaymentIntent)
            }
        });
    };

    useEffect(() => {
        fetchPaymentIntent(checkoutToken);
    },);

    const Form = () => (activeStep === 0)
        ? <AddressForm cart={cart} checkoutToken={checkoutToken} next={next}/>
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} backStep={backStep} onCaptureCheckout={onCaptureCheckout} nextStep={nextStep} paymentIntent={paymentIntent}/>;

  return (
    <>
        {console.log(paymentIntent)}
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
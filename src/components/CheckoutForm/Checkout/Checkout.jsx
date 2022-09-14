import React, { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import { commerce } from '../../../lib/commerce';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../PaymentForm';
import { connect } from 'react-redux';

const steps = ['Shipping Address', 'Payment Details']


const Checkout = ({ props, cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});

    const classes = useStyles();

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    
    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                setCheckoutToken(token);
            } catch (tokenError) {
                console.log(tokenError);
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
    
    const getPaymentIntent = () => {
        this.props.dispatch({ type: 'GET_PAYMENT_SECRET', payload: checkoutToken })
    }

    useEffect(() => {
        getPaymentIntent();
      },[]);
    

    const Form = () => (activeStep === 0)
        ? <AddressForm cart={cart} checkoutToken={checkoutToken} next={next}/>
        : <PaymentForm checkoutToken={checkoutToken}/>;

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

const mapStateToProps = state => {
    return {
        props: state
    }
}

export default connect(mapStateToProps)(Checkout);
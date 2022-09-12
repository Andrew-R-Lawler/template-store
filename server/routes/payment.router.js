const { ViewModuleSharp } = require('@material-ui/icons');
const express = require('express');
const router = express.Router();
const Stripe = require('stripe')
const stripe = Stripe('sk_test_51LgN3XGgp3GmJutylJb1ddRJLyrnofCLcRyJEO25EQrpANTlgqGSI94nF3C3CQHqPsQIh540TXtK2Fyc4hRsnAh600tKpD6eLE');

router.post("/", async (req, res) => {
    const { subtotal } = req.body.subtotal;
      console.log(req.body.subtotal);
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: subtotal,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

module.exports = router;
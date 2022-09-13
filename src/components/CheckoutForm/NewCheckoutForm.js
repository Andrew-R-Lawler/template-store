import React from 'react';
import {PaymentElement} from '@stripe/react-stripe-js';

const NewCheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};

export default NewCheckoutForm;
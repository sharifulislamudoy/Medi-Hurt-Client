import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../Components/Checkout/CheckoutForm';
import { ReTitle } from 're-title';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  return (
    <div className="container mx-auto py-10">
      <ReTitle title='Medi Hurt | Checkout' />
      <h1 className="text-3xl font-bold text-teal-900 text-center mb-6">Complete Your Payment</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;

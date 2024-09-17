"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutForm = () => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const { clientSecret } = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }),
    }).then((res) => res.json());

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      setSucceeded(true);
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-md mx-auto p-4"
    >
      <h1 className="text-gray-800 text-center text-lg font-semibold mb-4">
        Card Info
      </h1>

      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
        <CardNumberElement className="w-full text-black bg-transparent border-none h-[40px] p-3 outline-none" />
      </div>

      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
        <CardExpiryElement className="w-full text-black bg-transparent border-none h-[40px] p-3 outline-none" />
      </div>

      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-4">
        <CardCvcElement className="w-full text-black bg-transparent border-none h-[40px] p-3 outline-none" />
      </div>

      <button
        type="submit"
        className="flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] w-full text-lg text-white font-semibold"
        disabled={!stripe || processing}
      >
        {processing ? "Processing…" : "Pay"}
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}
      {succeeded && (
        <div className="text-green-500 mt-2">Payment succeeded!</div>
      )}
    </form>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;

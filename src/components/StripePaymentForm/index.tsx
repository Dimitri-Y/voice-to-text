"use client";

// import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
// );

interface StripeMenuProps {
  userId: string;
  plan: "ONE_TIME" | "MONTHLY";
}
const StripePaymentForm: React.FC<StripeMenuProps> = ({ userId, plan }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
      // const { sessionId } = await response.json();

      // const stripe = await stripePromise;
      // await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
      toast.error("Error creating Stripe session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">
        Free trials have expired (3 trials), further available only in premium
        version{" "}
      </h1>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md text-base font-medium hover:bg-blue-700 mt-4 transition duration-300 ease-in-out flex items-center justify-center"
      >
        {loading ? "Processing..." : "Upgrade to Premium"}
      </button>
    </>
  );
};

export default StripePaymentForm;

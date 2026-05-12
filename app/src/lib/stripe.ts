import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export { stripePromise };

export async function createPaymentIntent(amount: number, email: string) {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return { success: true, clientSecret: data.clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { success: false, error };
  }
}

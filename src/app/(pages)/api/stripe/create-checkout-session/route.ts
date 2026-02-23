import { stripe } from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { plan, userId } = req.body as {
    plan: 'ONE_TIME' | 'MONTHLY';
    userId: string;
  };

  if (!plan || !userId) {
    return res.status(400).json({ error: 'Missing plan or userId' });
  }

  const priceId =
    plan === 'MONTHLY'
      ? process.env.STRIPE_PRICE_MONTHLY
      : process.env.STRIPE_PRICE_ONE_TIME;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: plan === 'MONTHLY' ? 'subscription' : 'payment',
      line_items: [
        { price: priceId!, quantity: 1 }
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: { userId, plan }
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
}

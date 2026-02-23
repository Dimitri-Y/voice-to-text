import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

const prisma = new PrismaClient();
export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const sig = req.headers["stripe-signature"]!;
  const buf = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return res.status(400).send("Webhook Error: invalid signature");
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, plan } = session.metadata! as {
        userId: string;
        plan: "ONE_TIME" | "MONTHLY";
      };

      if (plan === "ONE_TIME") {
        await prisma.payment.create({
          data: {
            userId,
            stripeChargeId: session.payment_intent as string,
            amount: session.amount_total!,
            currency: session.currency!,
            status: "COMPLETED",
          },
        });
      } else if (plan === "MONTHLY") {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        if (subscriptionId) {
          const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscriptionId },
            create: {
              userId,
              stripeSubscriptionId: subscriptionId,
              plan: "MONTHLY",
              status: "ACTIVE",
              currentPeriodEnd: new Date(stripeSub.current_period_end! * 1000),
            },
            update: {
              status: "ACTIVE",
              currentPeriodEnd: new Date(stripeSub.current_period_end! * 1000),
            },
          });
        }
      }
      break;
    }
    default:
      break;
  }

  res.json({ received: true });
}

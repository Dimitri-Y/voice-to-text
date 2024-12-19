import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia",
});

export async function POST(req: Request) {
    try {
        const { clerkId } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: { name: "Premium Membership" },
                        unit_amount: 1000,
                    },
                    quantity: 1,
                },
            ],
            metadata: { clerkId },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        return NextResponse.json({ error: "Error creating Stripe session." }, { status: 500 });
    }
}

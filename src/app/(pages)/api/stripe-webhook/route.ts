import Stripe from "stripe";
import { NextResponse } from "next/server";
import getRawBody from "raw-body";
import { Readable } from "stream";
import prisma from "../../../../../prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia",
});

export const config = {
    api: {
        bodyParser: false,
    },
};

function toReadable(req: Request): Readable {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Readable.from(req.body as any);
}

export async function POST(req: Request) {
    let buf: Buffer;

    try {
        buf = await getRawBody(toReadable(req), {
            length: req.headers.get("content-length") || undefined,
            encoding: req.headers.get("content-type")?.includes("text/") ? "utf8" : undefined,
        });
    } catch (error) {
        console.error("Failed to get raw body:", error);
        return NextResponse.json({ error: "Failed to process request body." }, { status: 400 });
    }

    const sig = req.headers.get("stripe-signature") || "";

    let event;
    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: `Webhook Error` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkId = session.metadata?.clerkId;

        if (clerkId) {
            try {
                await prisma.user.update({
                    where: { clerkId: clerkId },
                    data: { isPremium: true },
                });
            } catch (dbError) {
                console.error("Database update error:", dbError);
                return NextResponse.json({ error: "Failed to update user data." }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

/**
 * Stripe webhook. This — not the browser redirect — is what marks an order
 * paid and a piece sold. A customer can close the tab before being redirected,
 * and anyone can visit the success URL directly, so the redirect proves
 * nothing about payment.
 *
 * The signature is verified against the raw body. Without that check this
 * endpoint is an open door: anyone could POST a fake "payment succeeded" event
 * and get an order marked paid.
 */
export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!key || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = new Stripe(key);
  const body = await request.text(); // raw body — required for verification

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json(
      { error: `Signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId ?? session.client_reference_id;

    if (orderId) {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      // Idempotent: Stripe retries webhooks, and a repeat must not re-run the
      // side effects.
      if (order && order.status !== "paid") {
        const productIds = order.items
          .map((i) => i.productId)
          .filter((id): id is string => !!id);

        await db.$transaction([
          db.order.update({
            where: { id: order.id },
            data: {
              status: "paid",
              stripePaymentIntentId:
                typeof session.payment_intent === "string"
                  ? session.payment_intent
                  : null,
              shippingName: session.customer_details?.name ?? null,
              shippingAddress: session.customer_details?.address
                ? (session.customer_details.address as object)
                : undefined,
            },
          }),
          // The pieces are one of a kind: mark them sold so they cannot be
          // bought twice.
          db.product.updateMany({
            where: { id: { in: productIds } },
            data: { status: "sold" },
          }),
          // Clear them out of every cart, including other people's.
          db.cartItem.deleteMany({ where: { productId: { in: productIds } } }),
        ]);
      }
    }
  }

  return NextResponse.json({ received: true });
}

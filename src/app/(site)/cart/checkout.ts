"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCart } from "@/lib/cart";
import { site } from "@/data/site";

/**
 * Creates a Stripe Checkout session for the signed-in user's cart.
 *
 * Every price is read from the database inside this function. Nothing about
 * the amount comes from the client — a form field carrying a price would let
 * anyone pay one franc for a three-thousand franc jacket by editing the
 * request before it is sent.
 */
export async function checkoutAction() {
  const user = await requireUser();

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");

  const cart = await getCart();
  const items = (cart?.items ?? []).filter((i) => !i.unavailable);

  if (items.length === 0) {
    throw new Error("Nothing in the cart is available.");
  }

  // Re-check availability at the moment of checkout: a piece can sell between
  // the cart page rendering and this action running.
  const ids = items.map((i) => i.product.id);
  const live = await db.product.findMany({
    where: { id: { in: ids }, status: "live" },
  });

  if (live.length === 0) {
    throw new Error("Those pieces have sold.");
  }

  const totalCHF = live.reduce((sum, p) => sum + p.priceCHF, 0);

  // The order is recorded as pending first, so a completed payment always has
  // somewhere to land even if the webhook arrives before the redirect returns.
  const order = await db.order.create({
    data: {
      userId: user.id,
      email: user.email,
      status: "pending",
      totalCHF,
      items: {
        create: live.map((p) => ({
          productId: p.id,
          brand: p.brand,
          name: p.name,
          size: p.size,
          priceCHF: p.priceCHF,
        })),
      },
    },
  });

  const stripe = new Stripe(key);
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    client_reference_id: order.id,
    metadata: { orderId: order.id, userId: user.id },
    line_items: live.map((p) => ({
      quantity: 1,
      price_data: {
        currency: "chf",
        unit_amount: p.priceCHF * 100, // Stripe takes the smallest unit.
        product_data: {
          name: `${p.brand} ${p.season} — ${p.name}`,
          description: `Size ${p.size}`,
        },
      },
    })),
    shipping_address_collection: {
      allowed_countries: ["CH", "DE", "FR", "IT", "AT", "GB", "NL", "BE", "ES", "SE", "DK", "NO", "US"],
    },
    success_url: `${origin}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
  });

  await db.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");

  redirect(session.url);
}

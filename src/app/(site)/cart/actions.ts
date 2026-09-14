"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser, requireUser } from "@/lib/auth";
import { addToCart, removeFromCart } from "@/lib/cart";

/**
 * Server actions are public endpoints. Anyone who knows the action id can call
 * these directly, so each one resolves the user from the session — it never
 * accepts a user id or cart id from the form.
 */

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  // Note: getUser rather than requireUser, because redirect() works by
  // throwing — putting it inside a catch would swallow the redirect signal.
  const user = await getUser();

  if (!user) {
    const slug = String(formData.get("slug") ?? "");
    redirect(`/sign-in?next=${encodeURIComponent(`/shop/${slug}`)}`);
  }

  await addToCart(user.id, productId);
  revalidatePath("/cart");
  redirect("/cart");
}

export async function removeFromCartAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  const user = await requireUser();
  await removeFromCart(user.id, productId);
  revalidatePath("/cart");
}

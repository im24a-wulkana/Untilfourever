import { db } from "./db";
import { getUser } from "./auth";

/**
 * Cart reads and writes. Every function resolves the cart from the *session*
 * user id rather than taking a cart id from the caller — a cart id in a form
 * field would let anyone read or empty someone else's cart by guessing it.
 */

async function getOrCreateCart(userId: string) {
  return db.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function getCart() {
  const user = await getUser();
  if (!user) return null;

  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { addedAt: "desc" },
      },
    },
  });

  if (!cart) return { items: [], totalUSD: 0 };

  // A piece that sold while sitting in a cart must not be checked out. It
  // stays visible so the person can see what happened, but is not billable.
  const items = cart.items.map((item) => ({
    ...item,
    unavailable: item.product.status !== "live",
  }));

  const totalUSD = items
    .filter((i) => !i.unavailable)
    .reduce((sum, i) => sum + i.product.priceUSD, 0);

  return { items, totalUSD };
}

export async function getCartCount(): Promise<number> {
  const user = await getUser();
  if (!user) return 0;
  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    select: { _count: { select: { items: true } } },
  });
  return cart?._count.items ?? 0;
}

export async function addToCart(userId: string, productId: string) {
  const product = await db.product.findUnique({ where: { id: productId } });

  if (!product || product.status !== "live") {
    throw new Error("That piece is no longer available.");
  }

  const cart = await getOrCreateCart(userId);

  // Archive pieces are unique, so adding twice is a no-op rather than an
  // error — the compound unique on (cartId, productId) enforces it.
  await db.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: {},
    create: { cartId: cart.id, productId },
  });
}

export async function removeFromCart(userId: string, productId: string) {
  const cart = await db.cart.findUnique({ where: { userId } });
  if (!cart) return;

  // Scoped by cartId, so this cannot delete another user's row even if the
  // productId is guessed.
  await db.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
}

export async function clearCart(userId: string) {
  const cart = await db.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await db.cartItem.deleteMany({ where: { cartId: cart.id } });
}

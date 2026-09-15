/**
 * Action state for checkout. Lives outside the "use server" module because
 * such a module may only export async functions.
 */
export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string };

"use client";

import { useActionState } from "react";
import { checkoutAction } from "./checkout";
import type { CheckoutState } from "./types";

/**
 * Checkout, with the failure shown inline. The action returns its errors
 * rather than throwing so a misconfiguration or a piece selling mid-checkout
 * reads as an explanation rather than "A server error occurred".
 */
export function CheckoutButton() {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(
    checkoutAction,
    { status: "idle" },
  );

  return (
    <form action={action} className="mt-8">
      <button
        type="submit"
        disabled={pending}
        className="inline-block border border-bone px-6 py-4 text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60 disabled:opacity-40"
      >
        {pending ? "Taking you to payment…" : "Checkout"}
      </button>

      {state.status === "error" ? (
        <p className="mt-4 max-w-[52ch] border border-hairline px-4 py-3 text-body text-bone">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/**
 * Browser-side auth client. The Next entry point takes no arguments — it
 * resolves its own configuration — so there is no URL or secret to leak here.
 */
export const authClient = createAuthClient();

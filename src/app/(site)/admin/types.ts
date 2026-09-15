import type { ExtractionResult } from "@/lib/extract";

/**
 * Action state types live here rather than in actions.ts: a "use server"
 * module may only export async functions.
 */

export type ParseState =
  | { status: "idle" }
  | { status: "error"; message: string; caption: string }
  | { status: "parsed"; result: ExtractionResult; caption: string };

export type SaveState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | {
      status: "saved";
      id: string;
      imageCount: number;
      /** Set when some photographs uploaded and others failed. */
      warning?: string;
    };

import { put } from "@vercel/blob";

/**
 * Product photograph uploads.
 *
 * Every check here is server-side. The admin form also filters by accept=""
 * and size, but that is a convenience for the person uploading — it is not a
 * control, because anyone can call a server action directly with any payload.
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

/** Real image types only. No SVG: it can carry script and would execute. */
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export interface UploadResult {
  urls: string[];
  errors: string[];
}

/**
 * Uploads the given files and returns their public URLs, in the order given —
 * images[0] becomes the cover shot, so order matters.
 */
export async function uploadProductImages(
  files: File[],
  slug: string,
): Promise<UploadResult> {
  // Nothing to upload is not an error: a listing can be saved as a draft now
  // and photographed later. Checking this before the token means the token is
  // only required when it is actually needed.
  const present = files.filter((f) => f.size > 0);
  if (present.length === 0) return { urls: [], errors: [] };

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      urls: [],
      errors: [
        "BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in the Vercel dashboard and add the token to .env — see .env.example.",
      ],
    };
  }

  const urls: string[] = [];
  const errors: string[] = [];

  for (const [index, file] of files.entries()) {
    if (file.size === 0) continue;

    const extension = ALLOWED.get(file.type);
    if (!extension) {
      errors.push(
        `${file.name}: ${file.type || "unknown type"} is not allowed. Use JPEG, PNG, WebP or AVIF.`,
      );
      continue;
    }

    if (file.size > MAX_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      errors.push(`${file.name}: ${mb}MB is over the 8MB limit.`);
      continue;
    }

    try {
      // addRandomSuffix keeps two pieces with the same slug from overwriting
      // each other's photographs.
      const blob = await put(
        `products/${slug}/${String(index + 1).padStart(2, "0")}.${extension}`,
        file,
        { access: "public", addRandomSuffix: true },
      );
      urls.push(blob.url);
    } catch (error) {
      errors.push(
        `${file.name}: ${error instanceof Error ? error.message : "upload failed"}`,
      );
    }
  }

  return { urls, errors };
}

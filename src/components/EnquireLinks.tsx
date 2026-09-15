import { instagramDmUrl, site } from "@/data/site";

/**
 * Enquiries go to Instagram. There is no email address anywhere on the site,
 * so the DM deep link is the single contact route.
 */
export interface EnquireProduct {
  id: string;
  brand: string;
  season: string;
  name: string;
  size: string;
  priceUSD: number;
  sold?: boolean;
}

export function EnquireLinks({ product }: { product: EnquireProduct }) {
  if (product.sold) {
    return (
      <div className="border-t border-hairline pt-5">
        <p className="text-label uppercase tracking-caps text-meta">
          This piece has sold
        </p>
        <p className="mt-2 text-body text-meta">
          Message us on{" "}
          <a
            href={instagramDmUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rule-link text-black"
          >
            Instagram
          </a>{" "}
          to hear when something comparable comes in.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-hairline pt-5">
      <p className="text-label uppercase tracking-caps text-meta">
        Questions about fit or condition?
      </p>
      <p className="mt-2 text-body text-black">
        Message{" "}
        <a
          href={instagramDmUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rule-link text-black"
        >
          @{site.instagramHandle}
        </a>{" "}
        on Instagram.
      </p>
    </div>
  );
}

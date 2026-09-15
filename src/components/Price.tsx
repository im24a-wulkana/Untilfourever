/**
 * Prices are whole dollars — the archive has no cent-level pricing, and
 * showing "$3,200.00" on a piece priced at $3,200 reads as machine output
 * rather than a price tag.
 */
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(priceUSD: number): string {
  return formatter.format(priceUSD);
}

/**
 * Sold state is never conveyed by the strikethrough alone — a line-through is
 * invisible to a screen reader and to anyone who can't perceive it. The word
 * "sold" is always rendered alongside it.
 */
export function Price({
  priceUSD,
  sold,
  className = "",
}: {
  priceUSD: number;
  sold?: boolean;
  className?: string;
}) {
  if (!sold) {
    return <span className={className}>{formatPrice(priceUSD)}</span>;
  }

  return (
    <span className={className}>
      <s className="text-meta">{formatPrice(priceUSD)}</s>{" "}
      <span className="text-meta">Sold</span>
    </span>
  );
}

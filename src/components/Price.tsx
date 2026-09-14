const formatter = new Intl.NumberFormat("de-CH", {
  style: "decimal",
  maximumFractionDigits: 0,
});

export function formatPrice(priceCHF: number): string {
  return `CHF ${formatter.format(priceCHF)}`;
}

/**
 * Sold state is never conveyed by the strikethrough alone — a line-through is
 * invisible to a screen reader and to anyone who can't perceive it. The word
 * "sold" is always rendered alongside it.
 */
export function Price({
  priceCHF,
  sold,
  className = "",
}: {
  priceCHF: number;
  sold?: boolean;
  className?: string;
}) {
  if (!sold) {
    return <span className={className}>{formatPrice(priceCHF)}</span>;
  }

  return (
    <span className={className}>
      <s className="text-meta">{formatPrice(priceCHF)}</s>{" "}
      <span className="text-meta">Sold</span>
    </span>
  );
}

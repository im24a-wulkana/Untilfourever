import Link from "next/link";
import { brands, categories, sizes } from "@/data/products";

export interface ShopQuery {
  brand?: string;
  size?: string;
  category?: string;
  sold?: string;
}

/**
 * Filters are plain links that rewrite the query string. No client state, no
 * dropdowns — every filtered view is a real URL that can be linked and shared,
 * and the page stays a Server Component.
 */
function buildHref(current: ShopQuery, key: keyof ShopQuery, value: string | null): string {
  const next = new URLSearchParams();

  for (const [k, v] of Object.entries(current)) {
    if (v && k !== key) next.set(k, v);
  }
  if (value !== null) next.set(key, value);

  const qs = next.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

function FilterRow({
  label,
  options,
  paramKey,
  current,
  allLabel = "All",
}: {
  label: string;
  options: readonly string[];
  paramKey: keyof ShopQuery;
  current: ShopQuery;
  allLabel?: string;
}) {
  const active = current[paramKey];

  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2">
      <span className="w-16 shrink-0 text-label uppercase tracking-caps text-meta">
        {label}
      </span>

      <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <li>
          <Link
            href={buildHref(current, paramKey, null)}
            aria-current={!active ? "true" : undefined}
            className={`text-label uppercase tracking-caps ${
              active ? "rule-link text-meta" : "text-bone underline underline-offset-4"
            }`}
          >
            {allLabel}
          </Link>
        </li>

        {options.map((option) => {
          const isActive = active === option;
          return (
            <li key={option}>
              <Link
                href={buildHref(current, paramKey, option)}
                aria-current={isActive ? "true" : undefined}
                className={`text-label uppercase tracking-caps ${
                  isActive ? "text-bone underline underline-offset-4" : "rule-link text-meta"
                }`}
              >
                {option}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ShopFilters({ current }: { current: ShopQuery }) {
  return (
    <section aria-label="Filter the archive" className="border-b border-hairline">
      <div className="divide-y divide-hairline px-5 md:px-8">
        <FilterRow label="Brand" options={brands} paramKey="brand" current={current} />
        <FilterRow label="Size" options={sizes} paramKey="size" current={current} />
        <FilterRow label="Type" options={categories} paramKey="category" current={current} />
        <FilterRow
          label="Status"
          options={["available", "sold"]}
          paramKey="sold"
          current={current}
          allLabel="All"
        />
      </div>
    </section>
  );
}

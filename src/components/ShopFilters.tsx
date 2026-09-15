import Link from "next/link";

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

export interface Facets {
  brands: string[];
  sizes: string[];
  categories: string[];
}

export function ShopFilters({
  current,
  facets,
}: {
  current: ShopQuery;
  facets: Facets;
}) {
  const { brands, sizes, categories } = facets;

  // With an empty catalogue there is nothing to filter by.
  if (brands.length === 0) return null;

  const active = [current.brand, current.size, current.category, current.sold]
    .filter(Boolean).length;

  return (
    <section aria-label="Filter the archive" className="border-b border-hairline">
      {/* On a phone four filter rows filled the entire first screen, so the
          shop opened on filters rather than on clothes. The rows collapse
          behind one line below md, and are always shown above it.

          This is a checkbox rather than <details> because a stray rule was
          overriding the browser's default hiding of closed details content,
          and `peer-checked` is unambiguous about what is visible. */}
      <input
        type="checkbox"
        id="filters-open"
        className="peer sr-only"
        aria-hidden
        tabIndex={-1}
      />
      <label
        htmlFor="filters-open"
        data-touch-target
        className="flex cursor-pointer items-baseline justify-between px-5 py-4 text-label uppercase tracking-caps text-meta md:hidden"
      >
        <span>Filter{active > 0 ? ` (${active})` : ""}</span>
        <span aria-hidden className="text-bone peer-checked:hidden">+</span>
      </label>

      <div
        data-touch-target
        className="hidden divide-y divide-hairline border-t border-hairline px-5 peer-checked:block md:block md:border-t-0 md:px-8"
      >
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

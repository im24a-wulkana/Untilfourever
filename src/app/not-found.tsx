import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-5 py-24 md:px-8 md:py-32">
      <h1 className="text-label-lg uppercase tracking-caps text-meta">
        Not found
      </h1>
      <p className="mt-6 max-w-[48ch] text-editorial text-bone">
        This piece has either sold and been taken down, or the link is wrong.
      </p>
      <p className="mt-8">
        <Link
          href="/shop"
          className="rule-link text-label-lg uppercase tracking-caps text-bone"
        >
          Back to shop
        </Link>
      </p>
    </div>
  );
}

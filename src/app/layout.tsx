import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

/**
 * Inter is the fallback only — the stack in globals.css puts real Helvetica
 * Neue first, so visitors on macOS and iOS never download this. preload is
 * therefore off: preloading a font most visitors won't render is wasted
 * bandwidth on the critical path.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: false,
});

/**
 * The wordmark only. A geometric sans in the Futura lineage, which is the
 * family the reference mark descends from — set in caps with wide tracking it
 * reads like a fashion house wordmark rather than like the body text.
 * Preloaded because it renders above the fold on every page.
 */
const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-wordmark-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jost.variable}`}>
      {/* Chrome lives in the route group layouts: the splash has none, every
          other page has header and footer. */}
      <body className="grain flex min-h-dvh flex-col bg-black text-bone">
        {children}
      </body>
    </html>
  );
}

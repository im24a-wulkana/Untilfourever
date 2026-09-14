import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Every page except the splash: header, content, footer. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-4 focus:z-50 focus:border focus:border-bone focus:bg-black focus:px-3 focus:py-2 focus:text-label focus:uppercase focus:tracking-caps"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>

      <Footer />
    </>
  );
}

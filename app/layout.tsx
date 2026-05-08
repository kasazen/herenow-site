import type { Metadata, Viewport } from "next";
import Script from "next/script";
import BrandSpine from "./_components/BrandSpine";
import SiteNav from "./_components/SiteNav";
import navStyles from "./_components/SiteNav.module.css";
import "./globals.css";

const SITE_URL = "https://herenowlabs.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Here Now Labs",
    template: "%s · Here Now Labs",
  },
  description:
    "AI you haven't built yet, hiding in your operation. We come in for two weeks, find what AI can do with your contracts, processes, and financials, and ship it.",
  openGraph: {
    title: "Here Now Labs",
    description:
      "AI you haven't built yet, hiding in your operation. Two weeks. Paid. A working deliverable.",
    url: SITE_URL,
    siteName: "Here Now Labs",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Here Now Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Here Now Labs",
    description:
      "AI you haven't built yet, hiding in your operation.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='4' fill='%23faf9f5'/%3E%3Crect x='6' y='6' width='5' height='5' fill='%2315803d'/%3E%3Crect x='13' y='6' width='5' height='5' fill='%2315803d'/%3E%3Crect x='20' y='6' width='5' height='5' fill='%2315803d'/%3E%3Crect x='6' y='13' width='5' height='5' fill='%2315803d'/%3E%3Crect x='13' y='13' width='5' height='5' fill='%2315803d'/%3E%3Crect x='20' y='13' width='5' height='5' fill='%2315803d'/%3E%3C/svg%3E",
      },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#14141a" },
  ],
};

const PROFESSIONAL_SERVICE_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Here Now Labs",
  url: SITE_URL,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  image: `${SITE_URL}/og-image.png`,
  description:
    "AI advisory and build firm. Two-week paid sprints produce a ranked, priced, sequenced list of AI moves. Build engagements ship the moves.",
  email: "team@herenowlabs.xyz",
  areaServed: "US",
  priceRange: "$$$$",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&family=Fraunces:opsz,wght@9..144,300..600&family=Geist+Mono:wght@400;500&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_LD) }}
        />
      </head>
      <body>
        <SiteNav />
        <main>{children}</main>
        <BrandSpine />
        <footer className={navStyles.footer}>
          <div className={navStyles.footerInner}>
            <span>© Here Now Labs, Inc.</span>
            <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>
          </div>
        </footer>
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}

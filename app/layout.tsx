import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import SiteNav from "./_components/SiteNav";
import "./globals.css";

const SITE_URL = "https://herenowlabs.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Here Now Labs",
    template: "%s · Here Now Labs",
  },
  description:
    "AI inside your operation. We find your AI advantage in ten days, then build the software and agents that compound it for years.",
  openGraph: {
    title: "Here Now Labs",
    description:
      "AI inside your operation. Find your AI advantage. Build what compounds.",
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
      "AI inside your operation. Find your AI advantage. Build what compounds.",
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
    "AI-accelerated advisory for operators of established, profitable companies.",
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
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
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

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="wordmark" aria-label="Here Now Labs — home">
          Here Now Labs
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p>
            <span className="site-footer__mark" aria-hidden="true" />
            <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Here Now Labs</strong>
          </p>
          <p style={{ marginTop: "0.5rem", maxWidth: "28rem" }}>
            AI inside your operation. Find your AI advantage. Build what compounds.
          </p>
        </div>
        <div>
          <h4>Practice</h4>
          <ul>
            <li>
              <Link href="/how-we-work">How we work</Link>
            </li>
            <li>
              <Link href="/working-sessions">Working sessions</Link>
            </li>
            <li>
              <Link href="/ai-action-plan">AI Action Plan (sample)</Link>
            </li>
            <li>
              <Link href="/ai-action-plan-lite">AI Action Plan (Lite)</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li>
              <Link href="/contact">Contact form</Link>
            </li>
            <li>
              <a href="https://cal.com/herenowlabs/intro">Book a 30-minute intro</a>
            </li>
            <li>
              <a href="mailto:team@herenowlabs.xyz">team@herenowlabs.xyz</a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="site-footer__inner"
        style={{ marginTop: "2.5rem", fontSize: "0.85rem", color: "var(--faint)" }}
      >
        <p>© {year} Here Now Labs.</p>
      </div>
    </footer>
  );
}

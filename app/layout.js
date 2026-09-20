import { PLAN, SCHEMA_PRICE } from "@/lib/pricing";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

// The serif is reserved for big headlines, so we load the weight axis only —
// no SOFT/WONK/opsz. Smaller file, faster first paint on a phone.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

// The live address. Used for canonical URLs and to build the absolute URL of
// the OG image, so it must be the address people actually visit.
//
// Setting NEXT_PUBLIC_SITE_URL in Vercel overrides this. Nothing sets it today,
// so the fallback below is what ships — which is why it has to be the real
// domain and not the vercel.app one. If that variable is ever added in Vercel,
// it wins, so keep the two in step.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://getdayfive.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "DayFive — Automated Bookkeeping | Your Books Closed by Day Five",
    template: "%s · DayFive",
  },
  description:
    "DayFive is an automated bookkeeping service for small businesses. Your monthly close lands by business day 5 with five plain-English insights. Flat monthly price, no meetings, first month free.",
  // Deliberately national and capability-led. The page qualifies its market by
  // what a business has (transactions) rather than where it is, so geographic
  // and single-vertical terms were pulling against the copy they sit on.
  keywords: [
    "automated bookkeeping service",
    "outsourced bookkeeping",
    "virtual bookkeeping service",
    "monthly close",
    "catch-up bookkeeping",
    "small business accounting",
    "AI bookkeeping",
    "monthly bookkeeping service",
  ],
  applicationName: "DayFive",
  authors: [{ name: "DayFive" }],
  creator: "DayFive",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "DayFive",
    title: "Your books. Closed by day five. Every month.",
    description:
      "An automated bookkeeping service. Clean financials plus five ranked, plain-English insights by business day 5 — every month. First month free.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Your books. Closed by day five. Every month.",
    description:
      "An automated bookkeeping service. Clean financials plus five ranked insights by business day 5. First month free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  // The page opens on the navy hero band, so the phone's browser chrome
  // should match that rather than the cream body.
  themeColor: "#081426",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "DayFive",
  description:
    "Automated bookkeeping, one flat price. Monthly close delivered by business day 5 with five plain-English insights.",
  url: SITE_URL,
  email: "docs@getdayfive.com",
  areaServed: { "@type": "Country", name: "United States" },
  address: { "@type": "PostalAddress", addressCountry: "US" },
  // Structured data reads from lib/pricing.js like everything else. A search
  // engine quoting a price the page no longer charges is the worst place for
  // a stale number: it is cached, it is out of our hands, and the visitor sees
  // it before the site.
  priceRange: `${PLAN.price} per month`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Bookkeeping",
    itemListElement: [
      {
        "@type": "Offer",
        name: PLAN.name,
        price: SCHEMA_PRICE,
        priceCurrency: "USD",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="antialiased">
        {/* ANALYTICS SLOT — paste your provider snippet here when you're ready.
            Events are already being emitted by lib/analytics.js. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

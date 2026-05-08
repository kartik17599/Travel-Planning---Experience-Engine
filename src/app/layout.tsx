import type { Metadata } from "next";
import { cormorant, dmSans } from "./fonts";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "TravelAI | Premium Travel Engine",
  description: "Experience the world's most sophisticated AI travel planning engine. Luxury editorial itineraries crafted with real-time data.",
  keywords: ["travel engine", "ai travel", "luxury itineraries", "premium planning"],
  authors: [{ name: "TravelAI Design Engine" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

/**
 * Root layout component for TravelAI v5.1.
 * Integrates optimized Google Fonts and Google Analytics for maximum service alignment.
 * @param {Readonly<{ children: React.ReactNode }>} props - Component properties
 * @returns {React.JSX.Element} - Rendered layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Google Analytics - Professional Implementation */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="antialiased">
        <div className="mesh-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

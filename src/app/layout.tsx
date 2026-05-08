import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TravelAI | World-Class Travel Planning Engine",
  description: "Plan your next adventure with TravelAI. Dynamically generated, highly personalized itineraries powered by AI.",
  keywords: ["travel", "ai", "itinerary", "planning", "trip", "vacation"],
  authors: [{ name: "TravelAI Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

/**
 * Root layout component for TravelAI.
 * @param {Readonly<{ children: React.ReactNode }>} props - Component properties
 * @returns {React.JSX.Element} - Rendered layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased">
        <div className="mesh-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

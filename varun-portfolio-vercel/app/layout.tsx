import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://varunjdesigns.vercel.app"),
  title: {
    default: "Varun J — Complex Systems Product Designer",
    template: "%s — Varun J",
  },
  description: "Portfolio of Varun, a product designer simplifying enterprise workflows, data-heavy products and business-critical platforms.",
  keywords: [
    "enterprise UX designer",
    "product designer",
    "complex systems design",
    "workflow design",
    "Bengaluru product designer",
  ],
  authors: [{ name: "Varun J" }],
  creator: "Varun J",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Varun J — Product Design Portfolio",
    title: "Varun J — Complex Systems Product Designer",
    description: "Enterprise workflows, roles, rules and data turned into clear product experiences.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Varun J, Complex Systems Product Designer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun J — Complex Systems Product Designer",
    description: "Enterprise workflows, roles, rules and data turned into clear product experiences.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

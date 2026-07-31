import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://varunjdesigns.vercel.app"),
  title: {
    default: "Varun OS — Enterprise Product Designer",
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
    siteName: "Varun OS — Product Design Portfolio",
    title: "Varun OS — Enterprise Product Designer",
    description: "I design clarity into complex systems—turning enterprise roles, rules, data and decisions into workflows teams can trust.",
    images: [{ url: "/og.png", width: 1734, height: 911, alt: "Varun OS — I design clarity into complex systems." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun OS — Enterprise Product Designer",
    description: "I design clarity into complex systems.",
    images: ["/og.png"],
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
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="codex-preview" content="development" />
      </head>
      <body>{children}</body>
    </html>
  );
}

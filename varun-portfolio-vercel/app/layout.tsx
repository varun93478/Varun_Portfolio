import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Varun — Complex Systems Product Designer",
  description: "Portfolio of Varun, a product designer simplifying enterprise workflows, data-heavy products and business-critical platforms.",
  other: {
    "codex-preview": "development",
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

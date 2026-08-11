import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://varunjdesigns.vercel.app"),
  title: {
    default: "Varun J — UI/UX Designer",
    template: "%s — Varun J",
  },
  description: "Portfolio of Varun J, a UI/UX designer simplifying enterprise workflows, data-heavy products and business-critical platforms.",
  keywords: [
    "UI/UX designer",
    "enterprise UX designer",
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
    siteName: "Varun J — UI/UX Design Portfolio",
    title: "Varun J — UI/UX Designer",
    description: "I design clarity into complex systems—turning enterprise roles, rules, data and decisions into workflows teams can trust.",
    images: [{ url: "/og.png", width: 1734, height: 911, alt: "Varun OS — I design clarity into complex systems." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varun J — UI/UX Designer",
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
    <html lang="en" data-scroll-behavior="smooth" data-portfolio-theme="light" data-portfolio-theme-mode="light" style={{ colorScheme: "light" }} suppressHydrationWarning>
      <head>
        <meta name="codex-preview" content="development" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('varun-portfolio-theme')||'light';var a=localStorage.getItem('varun-portfolio-accent')||'#3155e7';var d=m==='dark'||m==='custom'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.portfolioTheme=d?'dark':'light';document.documentElement.dataset.portfolioThemeMode=m;document.documentElement.style.setProperty('--portfolio-accent',a);document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

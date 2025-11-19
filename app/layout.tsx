import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import { ClientLayout } from "./ClientLayout";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Contract ABI Interact",
    template: "%s | Contract ABI Interact",
  },
  description:
    "Interact with smart contracts across multiple blockchain networks. Deploy, read, write, and monitor smart contracts with ease.",
  keywords: [
    "smart contracts",
    "blockchain",
    "ethereum",
    "web3",
    "dapp",
    "contract interaction",
    "deploy contracts",
    "blockchain tools",
  ],
  authors: [{ name: "Contract ABI Interact" }],
  creator: "Contract ABI Interact",
  publisher: "Contract ABI Interact",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://contract-abi-interact.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Contract ABI Interact",
    title: "Contract ABI Interact - Interact with Smart Contracts",
    description:
      "Interact with smart contracts across multiple blockchain networks. Deploy, read, write, and monitor smart contracts with ease.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Contract ABI Interact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contract ABI Interact - Interact with Smart Contracts",
    description:
      "Interact with smart contracts across multiple blockchain networks. Deploy, read, write, and monitor smart contracts with ease.",
    images: ["/twitter-image"],
    creator: "@contractabiinteract",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

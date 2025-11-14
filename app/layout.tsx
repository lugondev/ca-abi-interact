import type { Metadata } from "next";
import { ClientLayout } from "./ClientLayout";

export const metadata: Metadata = {
  title: {
    default: "Just Smart Contracts",
    template: "%s | Just Smart Contracts",
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
  authors: [{ name: "Just Smart Contracts" }],
  creator: "Just Smart Contracts",
  publisher: "Just Smart Contracts",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://justsmartcontracts.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Just Smart Contracts",
    title: "Just Smart Contracts - Interact with Smart Contracts",
    description:
      "Interact with smart contracts across multiple blockchain networks. Deploy, read, write, and monitor smart contracts with ease.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Just Smart Contracts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Just Smart Contracts - Interact with Smart Contracts",
    description:
      "Interact with smart contracts across multiple blockchain networks. Deploy, read, write, and monitor smart contracts with ease.",
    images: ["/opengraph-image"],
    creator: "@justsmartcontracts",
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}


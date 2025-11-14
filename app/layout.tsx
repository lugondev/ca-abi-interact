"use client";

import "./globals.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@pages/error";
import { Layout } from "@widgets/layout";
import { NotificationsProvider } from "@shared/lib/notify";
import { Web3LoadingGuard } from "@app/Web3LoadingGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body>
        <ErrorBoundary fallback={<ErrorPage />}>
          <Web3LoadingGuard>
            <NotificationsProvider>
              <Layout>{children}</Layout>
            </NotificationsProvider>
          </Web3LoadingGuard>
        </ErrorBoundary>
      </body>
    </html>
  );
}


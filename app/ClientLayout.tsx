"use client";

import "./globals.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@pages/error";
import { Layout } from "@widgets/layout";
import { NotificationsProvider } from "@shared/lib/notify";
import { Web3LoadingGuard } from "@app/Web3LoadingGuard";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Web3LoadingGuard>
        <NotificationsProvider>
          <Layout>{children}</Layout>
        </NotificationsProvider>
      </Web3LoadingGuard>
    </ErrorBoundary>
  );
}


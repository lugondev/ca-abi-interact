"use client";

import "./globals.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@pages/error";
import { Layout } from "@widgets/layout";
import { NotificationsProvider } from "@shared/lib/notify";
import { Web3LoadingGuard } from "@app/Web3LoadingGuard";
import { ThemeProvider } from "@shared/lib/theme";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary fallback={<ErrorPage />}>
        <Web3LoadingGuard>
          <NotificationsProvider>
            <Layout>{children}</Layout>
          </NotificationsProvider>
        </Web3LoadingGuard>
      </ErrorBoundary>
    </ThemeProvider>
  );
}


"use client";

import "./globals.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "@pages/error";
import { Layout } from "@widgets/layout";
import { NotificationsProvider } from "@shared/lib/notify";
import { AlertProvider } from "@shared/lib/alert";
import { Web3LoadingGuard } from "@app/Web3LoadingGuard";
import { ThemeProvider } from "@shared/lib/theme";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary fallback={<ErrorPage />}>
        <Web3LoadingGuard>
          <NotificationsProvider>
            <AlertProvider>
              <Layout>{children}</Layout>
            </AlertProvider>
          </NotificationsProvider>
        </Web3LoadingGuard>
      </ErrorBoundary>
    </ThemeProvider>
  );
}


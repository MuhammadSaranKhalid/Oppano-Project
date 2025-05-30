import { DevtoolsProvider } from "@providers/devtools";
import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { Inter } from "next/font/google";

import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import "./globals.css";
import { IconSidebar } from "@components/icon-sidebar";
import { AppSidebar } from "@components/sidebar";
import { Toaster } from "@components/ui/toaster";
import { AuthProvider } from "@components/auth/auth-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Refine",
  description: "Generated by create refine app",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          {/* <GitHubBanner /> */}
          <RefineKbarProvider>
            {/* <DevtoolsProvider> */}
              <Refine
                routerProvider={routerProvider}
                authProvider={authProviderClient}
                dataProvider={dataProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "aT4IBS-xQMoSw-5p90yQ",
                }}
              >
                {/* {children} */}
                {/* <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem
                > */}
                <AuthProvider>
                  {children}</AuthProvider>
                {/* </ThemeProvider> */}
                <Toaster />
                {/* {children} */}
                <RefineKbar />
              </Refine>
            {/* </DevtoolsProvider> */}
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}

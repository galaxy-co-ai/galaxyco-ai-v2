import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "../components/providers";
import MainSidebar from "../components/layout/MainSidebar";
import { TopBar } from "../components/layout/TopBar";
import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "GalaxyCo.ai - Make multi-agent AI useful in minutes",
  description:
    "Personalized AI agent Packs that deliver measurable outcomes from Day 1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Providers>
            <MainSidebar />
            <TopBar />
            <main
              style={{
                marginLeft: "64px", // Space for collapsed sidebar
                paddingTop: "64px", // Space for top bar
                minHeight: "100vh",
              }}
              className="main-content-wrapper"
            >
              {children}
            </main>
            <Toaster />
            <Sonner position="bottom-right" richColors />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

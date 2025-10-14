import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "../components/providers";
import { SidebarProvider } from "../contexts/SidebarContext";
import MainSidebar from "../components/layout/MainSidebar";
import MainContent from "../components/layout/MainContent";
import { TopBar } from "../components/layout/TopBar";
import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import type { Metadata } from "next";
import "@picocss/pico/css/pico.min.css"; // Classless CSS framework for automatic styling
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
            <SidebarProvider>
              <MainSidebar />
              <TopBar />
              <MainContent>{children}</MainContent>
              <Toaster />
              <Sonner position="bottom-right" richColors />
            </SidebarProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "../components/providers";
import MainSidebar from "../components/layout/MainSidebar";
import type { Metadata } from "next";

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
      <html lang="en">
        <body>
          <Providers>
            <MainSidebar />
            <div
              style={{
                marginLeft: "64px", // Space for collapsed sidebar
                minHeight: "100vh",
              }}
              className="main-content-wrapper"
            >
              {children}
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

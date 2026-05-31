import type { Metadata } from "next";
import type { ReactNode } from "react";
import "reactflow/dist/style.css";
import "./globals.css";
import { DemoLayout } from "@/components/layout/DemoLayout";
import { AnalysisProvider } from "@/lib/AnalysisContext";

export const metadata: Metadata = {
  title: "ShadowOS - AI Operational Intelligence System",
  description: "AI operational intelligence for real estate workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AnalysisProvider>
          <DemoLayout>{children}</DemoLayout>
        </AnalysisProvider>
      </body>
    </html>
  );
}


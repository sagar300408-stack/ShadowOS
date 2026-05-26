import type { Metadata } from "next";
import type { ReactNode } from "react";
import "reactflow/dist/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadowOS",
  description: "AI operational intelligence for real estate workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Islamic Prayer Times API",
  description:
    "REST API for calculating Islamic prayer times for UK cities. Powered by astronomical calculations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-linear-to-br from-slate-900 to-slate-800">
      <body className="antialiased max-w-7xl mx-auto">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 antialiased dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              const savedTheme = localStorage.getItem('theme');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : (prefersDark ? 'dark' : 'light');
              document.documentElement.classList.toggle('dark', theme === 'dark');
            } catch {
              document.documentElement.classList.toggle('dark', false);
            }
          })();`}
        </Script>

        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 py-5">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

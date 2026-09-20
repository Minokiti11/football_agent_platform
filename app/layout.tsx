import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoStateProvider } from "@/components/demo-state-provider";
import { AppShell } from "@/components/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Football Learning Loop — Seaside FC U18",
  description:
    "試合の場面・選手の振り返り・指導者の対話をつなぐ、育成年代向けのコンセプトPoC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <DemoStateProvider>
          <AppShell>{children}</AppShell>
        </DemoStateProvider>
      </body>
    </html>
  );
}

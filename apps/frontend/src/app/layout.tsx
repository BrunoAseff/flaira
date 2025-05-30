import type { Metadata } from "next";
import { Quicksand, K2D } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/hooks/use-query";
import { SpeedInsights } from "@vercel/speed-insights/next";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const k2d = K2D({
  variable: "--font-k2d",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flaira",
  description: "A flight tracker platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${k2d.variable} antialiased font-sans`}
      >
        <QueryProvider>{children}</QueryProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

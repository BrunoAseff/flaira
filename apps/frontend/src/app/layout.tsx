import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/hooks/use-query";

const quicksand = Quicksand({
  variable: "--font-quicksand",
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
      <body className={`${quicksand.variable} antialiased font-sans`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

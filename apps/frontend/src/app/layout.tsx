import type { Metadata } from "next";
import { Parkinsans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/hooks/useQuery";

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
  weight: ["400"],
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
      <body className={`${parkinsans.variable} antialiased  font-sans`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

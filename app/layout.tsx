import type { Metadata } from "next";
import "./globals.css";
import Boot from "@/components/Apps/Boot";

export const metadata: Metadata = {
  title: "MOEDA",
  description: "Your OS, Reimagined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Boot></Boot>
        {children}
      </body>
    </html>
  );
}

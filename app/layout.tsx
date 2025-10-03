import type { Metadata } from "next";
import "./common.scss";
import Cursor from "@/atoms/Cursor/Cursor";
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
        <Cursor />
        <Boot></Boot>
        {children}
      </body>
    </html>
  );
}

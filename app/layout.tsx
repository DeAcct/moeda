// app/layout.tsx

import type { Metadata } from "next";
import "@/styles/main.scss";
import Boot from "@/components/Apps/Boot";
import Cursor from "@/components/Atoms/Cursor";
import Style from "./SystemUI.module.scss";

export const metadata: Metadata = {
  title: "MOEDA",
  description: "Your OS, Reimagined.",
};

export default function SystemUI({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={Style.UI}>
        <Cursor />
        <Boot></Boot>
        {children}
      </body>
    </html>
  );
}

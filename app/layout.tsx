// app/layout.tsx

import type { Metadata } from "next";
import "./common.scss";
import Boot from "@/components/Apps/Boot/Boot";
import Cursor from "@/components/Atoms/Cursor/Cursor";
import MenuBar from "@/components/Organisms/MenuBar/MenuBar";
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
        <MenuBar />
        <Cursor />
        <Boot></Boot>
        {children}
      </body>
    </html>
  );
}

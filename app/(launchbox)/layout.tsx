import type { PropsWithChildren } from "react";
import MenuBar from "@/components/Organisms/MenuBar";

export default function LaunchBox({ children }: PropsWithChildren) {
  return (
    <>
      <MenuBar />
      {children}
    </>
  );
}

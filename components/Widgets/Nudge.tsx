import type { PropsWithChildren } from "react";
import GlassContainer from "./GlassContainer";

export default function Nudge({ children }: PropsWithChildren) {
  return (
    <GlassContainer
      className="rounded-full px-4 h-12 items-center flex"
      strength="15"
      radius="12"
    >
      <p className="bg-clip-text bg-linear-to-r from-white via-white/30 to-white text-[transparent] bg-size-[200%] animate-nudge font-[500] text-xl">
        {children}
      </p>
    </GlassContainer>
  );
}

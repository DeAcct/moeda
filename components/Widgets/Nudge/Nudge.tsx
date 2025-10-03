import type { PropsWithChildren } from "react";
import GlassContainer from "../GlassContainer";
import Style from "./Nudge.module.scss";

export default function Nudge({ children }: PropsWithChildren) {
  return (
    <GlassContainer className={Style.nudge} strength="15" radius="16">
      <p className="bg-clip-text bg-linear-to-r from-white via-white/30 to-white text-[transparent] bg-size-[200%] animate-nudge font-[500] text-xl">
        {children}
      </p>
    </GlassContainer>
  );
}

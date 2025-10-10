import clsx from "clsx";
import type { ComponentProps } from "react";
import GlassContainer from "../../Atoms/GlassContainer";
import Style from "./Nudge.module.scss";

export default function Nudge({ children, className }: ComponentProps<"div">) {
  const rootStyle = clsx(className, Style.nudge);
  return (
    <GlassContainer className={rootStyle} strength="15" radius="16">
      <p className={Style.text}>{children}</p>
    </GlassContainer>
  );
}

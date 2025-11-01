"use client";

import clsx from "clsx";
import type { ComponentProps } from "react";
import Flipper from "@/components/Atoms/Flipper";
import GlassContainer from "@/components/Atoms/GlassContainer";
import { useTime } from "@/hook/time";
import Style from "./FlipClock.module.scss";

export default function Clock({ children, className }: ComponentProps<"div">) {
  const time = useTime();

  // 시간을 두 자리 문자열로 포맷팅 (예: 7 -> "07")
  const formatTwoDigits = (n: number) => n.toString().padStart(2, "0");

  const hours = formatTwoDigits(time.getHours());
  const minutes = formatTwoDigits(time.getMinutes());

  const rootStyle = clsx(className, Style.clock);

  return (
    <GlassContainer
      radius={16}
      depth={1}
      className={rootStyle}
      data-cursor-interactive
    >
      <div className={Style.time}>
        <div className={Style.flippers}>
          <Flipper value={hours}></Flipper>
        </div>
        <div className={Style.flippers}>
          <Flipper value={minutes}></Flipper>
        </div>
      </div>

      {children}
    </GlassContainer>
  );
}

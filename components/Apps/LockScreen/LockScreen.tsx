// LockScreen.tsx

import Link from "next/link";

import BootSound from "@/components/Atoms/BootSound";
import FlipClock from "@/components/Widgets/FlipClock";
import Nudge from "@/components/Widgets/Nudge";
import Weather from "@/components/Widgets/Weather";

import Style from "./LockScreen.module.scss";

export default function LockScreen() {
  return (
    <div className={Style.layout}>
      <Link href="/home" className={Style.tapAnywhere}></Link>
      <BootSound />
      <FlipClock className={Style.clock}>
        <Weather />
      </FlipClock>
      <Nudge className={Style.nudge}>화면 아무데나 눌러 잠금해제</Nudge>
    </div>
  );
}

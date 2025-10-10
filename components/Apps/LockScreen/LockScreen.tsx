// LockScreen.tsx

import Link from "next/link";
import BootSound from "@/components/Atoms/BootSound";
import Clock from "../../Widgets/Clock/Clock";
import Nudge from "../../Widgets/Nudge/Nudge";
import Weather from "../../Widgets/Weather/Weather";
import Style from "./LockScreen.module.scss";

export default function LockScreen() {
  return (
    <div className={Style.layout}>
      <Link href="/home" className={Style.tapAnywhere}></Link>
      <BootSound />
      <Clock className={Style.clock}>
        <Weather />
      </Clock>
      <Nudge className={Style.nudge}>화면 아무데나 눌러 잠금해제</Nudge>
    </div>
  );
}

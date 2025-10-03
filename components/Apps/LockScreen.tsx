// LockScreen.tsx

import Link from "next/link";
import BootSound from "@/atoms/BootSound";
import Clock from "../Widgets/Clock/Clock";
import Nudge from "../Widgets/Nudge/Nudge";
import Weather from "../Widgets/Weather/Weather";
import Style from "./LockScreen.module.scss";

export default function LockScreen() {
  return (
    <>
      <Link href="/home" className={Style.tapAnywhere}></Link>
      <div className={Style.layout}>
        <BootSound />
        <Clock>
          <Weather />
        </Clock>
        <Nudge>화면 아무데나 눌러 잠금해제</Nudge>
      </div>
    </>
  );
}

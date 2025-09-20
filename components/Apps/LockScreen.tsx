import Clock from "../Widgets/Clock";
import Nudge from "../Widgets/Nudge";
import Weather from "../Widgets/Weather";

export default function LockScreen() {
  return (
    <div className="w-full h-[100dvh] bg-[url(/abstract_purple.jpg)] bg-cover bg-center flex flex-col items-center justify-between py-24 lg:flex-row only:justify-center lg:px-10">
      <Clock>
        <Weather />
      </Clock>
      <Nudge>화면을 위로 올려 잠금해제</Nudge>
    </div>
  );
}

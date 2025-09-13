import Clock from "../Widgets/Clock";
import Weather from "../Widgets/Weather";

export default function LockScreen() {
  return (
    <div className="w-full h-[100dvh] bg-[url(/abstract_white.jpg)] bg-cover bg-center flex flex-col items-center py-48">
      <Clock>
        <Weather />
      </Clock>
    </div>
  );
}

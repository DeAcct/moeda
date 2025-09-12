import Clock from "../Widgets/Clock";

export default function LockScreen() {
  return (
    <div className="w-full h-[100dvh] bg-[url(/mountain.jpg)] bg-cover bg-center flex flex-col items-center py-48">
      <Clock />
    </div>
  );
}

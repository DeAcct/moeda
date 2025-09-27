"use client";
import { useMouse } from "@/hook/mouse";

export default function Cursor() {
  const state = useMouse();

  const dynamicCursorStyle: React.CSSProperties = {
    left: `${state.x}px`,
    top: `${state.y}px`,
    width: `${state.width}px`,
    height: `${state.height}px`,
    borderRadius: state.radius,
  };

  return (
    <div
      className="origin-center fixed pointer-events-none z-[9999] bg-white/50 -translate-x-1/2 -translate-y-1/2 box-content transition-[border-radius] duration-100 ease-in-out"
      style={dynamicCursorStyle}
    />
  );
}

"use client";
import clsx from "clsx";
import { useMouse } from "@/hook/mouse";
import Style from "./Cursor.module.scss";

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
      className={clsx(Style.cursor, [{ [Style.hover]: "hover" }])}
      style={dynamicCursorStyle}
    />
  );
}

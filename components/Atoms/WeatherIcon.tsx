import type { ComponentProps } from "react";
import Cloudy from "./Cloudy";

export default function WeatherIcon({ className }: ComponentProps<"i">) {
  // todo: 날씨 아이콘 디자인
  return (
    <i className={className}>
      <Cloudy />
    </i>
  );
}

import type { ComponentProps } from "react";
import type { WeatherState } from "@/app/api/weather/types";
import Cloudy from "./Cloudy";
import Drops from "./Drops";
import DropsSnow from "./DropsSnow";
import Frowning from "./Frowning";
import Overcast from "./Overcast";
import Rain from "./Rain";
import Shower from "./Shower";
import Snow from "./Snow";
import SnowRain from "./SnowRain";
import Sunny from "./Sunny";

interface WeatherIconProps extends ComponentProps<"i"> {
  weatherState: WeatherState;
}

export default function WeatherIcon({
  className,
  weatherState,
}: WeatherIconProps) {
  const Icon = {
    sunny: Sunny,
    cloudy: Cloudy,
    overcast: Overcast,
    rain: Rain,
    snowRain: SnowRain,
    snow: Snow,
    shower: Shower,
    drops: Drops,
    dropsSnow: DropsSnow,
    frowning: Frowning,
    none: Sunny, // Fallback
  }[weatherState] || Sunny;

  return (
    <i className={className}>
      <Icon />
    </i>
  );
}

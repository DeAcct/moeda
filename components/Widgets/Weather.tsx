// Weather.tsx

"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import WeatherIcon from "@/atoms/WeatherIcon";

export default function Weather() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      // const { x, y } = toXY(latitude, longitude);
      const res = await fetch(
        `/api/weather?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await res.json();
      console.log(data);
      setWeather(data);
    });
  }, []);

  if (!weather) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="flex items-center"
    >
      <WeatherIcon />
      <span>{weather?.items?.temp}&#8451;</span>
    </motion.div>
  );
}

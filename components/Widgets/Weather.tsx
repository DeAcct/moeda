// Weather.tsx (수정 후)

"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
// Forecast 타입을 가져옵니다. (이전 대화에서 정의한 타입)
import type { ForecastData } from "@/app/api/weather/types";
import WeatherIcon from "@/atoms/WeatherIcon";

// API가 반환하는 전체 데이터 구조에 대한 타입
interface WeatherApiResponse {
  items: ForecastData;
  position: string;
  publishedTime: string;
}

export default function Weather() {
  // weather 상태는 ForecastData 타입의 객체를 가집니다.
  const [weather, setWeather] = useState<ForecastData>();
  const [position, setPosition] = useState<string>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `/api/weather?latitude=${latitude}&longitude=${longitude}`,
      );
      const data: WeatherApiResponse = await res.json();

      console.log(data);
      // 상태에 올바른 데이터를 저장합니다.
      if (data.items) {
        setWeather(data.items);
        setPosition(data.position);
      }
    });
  }, []);

  // 날씨 정보가 없으면 아무것도 렌더링하지 않습니다.
  if (!weather || !position) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="flex items-center gap-2 text-white" // 스타일 약간 추가
    >
      <WeatherIcon />
      <div className="flex flex-col items-end">
        {/* weather 상태에 바로 temp가 있으므로 직접 접근합니다. */}
        <span className="text-lg font-bold">{weather.temp}&#8451;</span>
        <span className="text-xs">{position}</span>
      </div>
    </motion.div>
  );
}

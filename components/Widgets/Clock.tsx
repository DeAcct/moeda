"use client";

import { useState, useEffect, PropsWithChildren } from "react";

export default function Clock({ children }: PropsWithChildren) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 컴포넌트가 언마운트될 때 타이머를 정리하여 메모리 누수 방지
    return () => clearInterval(timerId);
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 함

  return (
    <div className="flex flex-col items-center">
      <div className="text-white text-xl flex gap-2">
        <p className="flex items-center">
          {time.toLocaleDateString("ko-KR", {
            dateStyle: "long",
          })}
        </p>
        {children}
      </div>
      <time className="text-8xl font-[900] text-white bg-clip-text text-shadow-lg">
        {time.toLocaleTimeString("ko-KR", {
          hourCycle: "h23",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
    </div>
  );
}

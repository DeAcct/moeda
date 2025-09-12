"use client";

import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 컴포넌트가 언마운트될 때 타이머를 정리하여 메모리 누수 방지
    return () => clearInterval(timerId);
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 함

  return (
    <div className="flex flex-col">
      <p className="text-white flex gap-2">
        {time.toLocaleDateString("ko-KR", {
          dateStyle: "long",
        })}
        <span></span>
      </p>
      <time className="text-8xl font-[999] text-white bg-clip-text text-shadow-lg">
        {time.toLocaleTimeString("ko-KR", {
          hourCycle: "h23",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
    </div>
  );
}

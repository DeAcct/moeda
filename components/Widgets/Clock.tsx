// Clock.tsx

"use client";

import { useState, useEffect, PropsWithChildren } from "react";

export default function Clock({ children }: PropsWithChildren) {
  // 1. 처음에는 상태를 null로 초기화합니다.
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // 2. 컴포넌트가 클라이언트에 마운트된 후, 현재 시간을 설정합니다.
    setTime(new Date());

    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []); // 빈 배열은 이 useEffect가 마운트될 때 한 번만 실행되도록 합니다.

  // 3. time이 아직 설정되지 않았다면(서버 렌더링 또는 클라이언트 첫 렌더링 시) 아무것도 보여주지 않거나 로딩 상태를 보여줍니다.
  if (time === null) {
    return null; // 또는 <p>시간 로딩 중...</p> 과 같은 플레이스홀더를 반환할 수 있습니다.
  }

  return (
    <div className="flex flex-col items-center">
      <p className="flex items-center text-white text-xl">
        {time.toLocaleDateString("ko-KR", {
          dateStyle: "long",
        })}
      </p>
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

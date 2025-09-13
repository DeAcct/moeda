"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingStroke from "@/atoms/LoadingStroke";

export default function SystemUI() {
  const [showBootScreen, setShowBootScreen] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const hasBooted = localStorage.getItem("boot") === "true";

    // 이미 부팅한 기록이 있는 경우
    if (hasBooted) {
      // 부팅 화면을 보여주지 않고, 확인 작업만 종료
      return;
    }

    // --- 첫 부팅인 경우에만 아래 로직이 실행됩니다 ---

    // 1. 부팅 화면을 보여주도록 설정
    setShowBootScreen(true);

    // 3. 3초 후 사라지는 로직 실행
    const bootTimer = setTimeout(() => {
      setIsFading(true); // Fade-out 애니메이션 시작
      localStorage.setItem("boot", "true"); // 부팅 완료 기록

      const hideTimer = setTimeout(() => {
        setShowBootScreen(false); // 애니메이션 후 DOM에서 완전히 제거
      }, 500); // CSS transition 시간과 동일하게 설정

      return () => clearTimeout(hideTimer);
    }, 3000);

    return () => clearTimeout(bootTimer);
  }, []); // 이 useEffect는 컴포넌트 마운트 시 한 번만 실행됩니다.

  // 2. 부팅 화면을 보여줄 필요가 없으면 아무것도 렌더링하지 않습니다.
  if (!showBootScreen) {
    return null;
  }

  // 3. 첫 부팅일 때만 아래의 부팅 화면 UI를 렌더링합니다.
  return (
    <main
      className={`w-full h-[100dvh] bg-gray-950 flex flex-col gap-4 justify-center items-center transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src="/BrandLogo4x.png"
        width={96}
        height={96}
        priority
        alt="모으다"
      />
      <LoadingStroke>부팅중</LoadingStroke>
    </main>
  );
}

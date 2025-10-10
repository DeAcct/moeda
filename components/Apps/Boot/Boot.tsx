"use client";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingStroke from "@/components/Atoms/LoadingStroke/LoadingStroke";
import Style from "./Boot.module.scss";

export default function Boot() {
  // 1. 초기 상태를 null로 설정하여 '확인 중' 상태 표현
  const [showBootScreen, setShowBootScreen] = useState<boolean | null>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const hasBooted = localStorage.getItem("boot") === "true";

    // 이미 부팅했으면 false, 첫 부팅이면 true로 상태 설정
    setShowBootScreen(!hasBooted);

    if (!hasBooted) {
      // 첫 부팅일 때만 타이머 실행
      const bootTimer = setTimeout(() => {
        setIsFading(true); // Fade-out 애니메이션 시작
        localStorage.setItem("boot", "true"); // 부팅 완료 기록
      }, 3000);

      return () => clearTimeout(bootTimer);
    }
  }, []); // 마운트 시 한 번만 실행

  // 2. onTransitionEnd 이벤트 핸들러
  const handleTransitionEnd = () => {
    // isFading이 true일 때 (즉, 사라지는 애니메이션이 끝났을 때)만 실행
    if (isFading) {
      setShowBootScreen(false);
    }
  };

  // 3. 로딩 상태(null)이거나, 부팅이 끝났으면(false) 아무것도 렌더링하지 않음
  if (showBootScreen === null || showBootScreen === false) {
    return null;
  }

  // 첫 부팅일 때만 UI 렌더링
  return (
    <main
      className={clsx(Style.boot, { [Style.fading]: isFading })}
      onTransitionEnd={handleTransitionEnd} // 트랜지션 종료 시 함수 호출
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

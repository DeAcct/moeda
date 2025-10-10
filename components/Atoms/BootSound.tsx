"use client";

import { useEffect, useRef } from "react";

export default function BootSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/bootup.wav");
    audioRef.current.load();

    const playSound = () => {
      audioRef.current?.play();
      document.removeEventListener("click", playSound);
    };

    document.addEventListener("click", playSound);
  }, []);

  return null;
}

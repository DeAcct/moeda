"use client";

import { useTime } from "@/hook/time";

export default function Clock() {
  const time = useTime();
  return <time>{time.toLocaleDateString()}</time>;
}

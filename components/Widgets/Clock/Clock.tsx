"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type PropsWithChildren, useEffect, useState } from "react";
import GlassContainer from "../GlassContainer";
import Style from "./Clock.module.scss";

export default function Clock({ children }: PropsWithChildren) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // 시간을 두 자리 문자열로 포맷팅 (예: 7 -> "07")
  const formatTwoDigits = (n: number) => n.toString().padStart(2, "0");

  const hours = formatTwoDigits(time.getHours());
  const minutes = formatTwoDigits(time.getMinutes());

  return (
    <GlassContainer
      radius={16}
      depth={1}
      className={Style.clock}
      data-cursor-interactive
    >
      <div className={Style.time}>
        {/* 시간 */}
        <div className={Style.flippers}>
          {hours.split("").map((digit, index) => (
            <div key={index} className={Style.flipper}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={digit} // 숫자가 바뀔 때마다 key가 변경되어 애니메이션이 트리거됩니다.
                  initial={{ rotateX: -90, y: "-15px" }}
                  animate={{
                    rotateX: 0,
                    y: "0px",

                    transition: {
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 300,
                    },
                  }}
                  exit={{
                    rotateX: 90,
                    y: "15px",
                    opacity: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 300,
                    },
                  }}
                  className={Style.digit}
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* <div className={Style.separator}>:</div> */}

        {/* 분 */}
        <div className={Style.flippers}>
          {minutes.split("").map((digit, index) => (
            <div key={index} className={Style.flipper}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={digit}
                  initial={{ rotateX: -90, y: "-15px" }}
                  animate={{
                    rotateX: 0,
                    y: "0px",
                    transition: {
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 300,
                    },
                  }}
                  exit={{
                    rotateX: 90,
                    y: "15px",
                    opacity: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 300,
                    },
                  }}
                  className={Style.digit}
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      <p className={Style.date}>
        {time.toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </p>

      {children}
    </GlassContainer>
  );
}

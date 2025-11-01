"use client";
import { AnimatePresence, motion } from "framer-motion";
import Style from "./Flipper.module.scss";

const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });
export default function Flipper({ value }: { value: string | number }) {
  const stringValue = String(value);
  const digits = Array.from(segmenter.segment(stringValue)).map(
    (s) => s.segment,
  );

  return (
    <>
      {digits.map((digit, index) => (
        <div key={`${digit}-${index}`} className={Style.flipper}>
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
    </>
  );
}

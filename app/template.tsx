// app/template.tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { defaultTransition, transitionMap } from "@/lib/pageTransition";

export default function TransitionWrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const variants = transitionMap[pathname] || defaultTransition;

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname} // 경로가 바뀔 때마다 AnimatePresence가 감지
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

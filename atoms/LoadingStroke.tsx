import { PropsWithChildren } from "react";
// import styles from "./LoadingSpinner.module.scss";

export default function LoadingStroke({ children }: PropsWithChildren) {
  return (
    <>
      <span className="sr-only">{children}</span>
      <svg
        className="animate-dasharray will-change-transform"
        width="48"
        height="8"
        viewBox="0 0 48 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          className="stroke-slate-800 stroke-[4px] [stroke-linecap:round]"
          x1="4"
          y1="2"
          x2="44"
          y2="2"
        ></line>
        <line
          className="animate-stroke stroke-white stroke-[4px] [stroke-linecap:round]"
          x1="4"
          y1="2"
          x2="44"
          y2="2"
          strokeDasharray="48"
          strokeDashoffset="48"
        ></line>
      </svg>
    </>
  );
}

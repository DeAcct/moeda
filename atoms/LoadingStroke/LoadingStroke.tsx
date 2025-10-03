import type { PropsWithChildren } from "react";
import Style from "./LoadingStroke.module.scss";

export default function LoadingStroke({ children }: PropsWithChildren) {
  return (
    <i className={Style.loadingStroke}>
      <span className="sr-only">{children}</span>
      <svg
        width="48"
        height="8"
        viewBox="0 0 48 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{children}</title>
        <line className={Style.track} x1="4" y1="2" x2="44" y2="2"></line>
        <line
          className={Style.body}
          x1="4"
          y1="2"
          x2="44"
          y2="2"
          strokeDasharray="48"
          strokeDashoffset="48"
        ></line>
      </svg>
    </i>
  );
}

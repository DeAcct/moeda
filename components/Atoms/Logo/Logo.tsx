import clsx from "clsx";
import type { ComponentProps } from "react";
import Style from "./Logo.module.scss";

export default function Logo({
  children = "모으다",
  className,
}: ComponentProps<"svg">) {
  const rootStyle = clsx(Style.container, className);

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={rootStyle}
    >
      <title>{children}</title>
      <path d="M40.5352 4.72429C41.7726 3.394 44 4.26973 44 6.08659V41.9997C44 43.1042 43.1046 43.9997 42 43.9997H6C4.89543 43.9997 4 43.1042 4 41.9997V6.08659C4 4.26973 6.22737 3.394 7.46484 4.72429L24 22.4997L40.5352 4.72429Z" />
    </svg>
  );
}

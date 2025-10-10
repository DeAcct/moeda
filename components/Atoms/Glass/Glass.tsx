"use client";

import clsx from "clsx";
import React, { type ComponentType, forwardRef } from "react";
import { useLiquidGlass } from "@/hook/liquid-glass";
import Style from "./Glass.module.scss";

const componentCache = new Map<string | symbol, ComponentType<any>>();

const handler: ProxyHandler<Record<string, never>> = {
  // proxy의 기본 사양을 지키기 위함
  get(target: {}, prop: string | symbol, receiver: any) {
    // 태그 이름으로 symbol을 가질 일은 없음.
    if (typeof prop === "symbol") {
      return undefined;
    }

    const tagName = prop;

    if (componentCache.has(tagName)) {
      return componentCache.get(tagName);
    }

    const StyledComponent = forwardRef<HTMLElement, any>(
      (
        {
          className,
          children,
          strength,
          chroma,
          radius,
          depth,
          style,
          ...props
        },
        ref,
      ) => {
        const { ref: liquidRef, style: liquid } = useLiquidGlass({
          strength,
          chroma,
          radius,
          depth,
        });

        const handleRef = (el: HTMLElement | null) => {
          liquidRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        };

        const combinedStyle = { ...liquid, ...style };

        return React.createElement(
          tagName,
          {
            className: clsx(Style.glass, className),
            ref: handleRef,
            style: combinedStyle,
            ...props,
          },
          children,
        );
      },
    );

    StyledComponent.displayName = `glass.${tagName}`;
    componentCache.set(tagName, StyledComponent);

    return StyledComponent;
  },
};

const glass = new Proxy({}, handler);
export default glass as Record<string, ComponentType<any>>;

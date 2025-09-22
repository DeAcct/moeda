// components/GlassContainer.tsx (수정 후)

"use client";

import type { ComponentProps, ComponentPropsWithoutRef } from "react";
import glass from "@/atoms/Glass";

// 1. 사용 가능한 태그를 glass 팩토리의 key들로 한정합니다. (더욱 안전해집니다)
type GlassTag = keyof typeof glass;

// 2. T를 GlassTag로 제한하고, `glass[T]`의 props를 직접 가져옵니다.
//    이렇게 하면 `href` 같은 HTML 속성과 `css` 같은 팩토리 props를 모두 포함하게 됩니다.
type GlassContainerProps<T extends GlassTag> = {
  tag?: T;
} & ComponentProps<(typeof glass)[T]>; // Omit이 필요 없어지고 코드가 간결해집니다.

// 3. 컴포넌트 함수도 제네릭으로 만들어줍니다. 기본값은 'div'로 설정합니다.
export default function GlassContainer<T extends GlassTag = "div">({
  tag,
  children,
  className,
  ...rest
}: GlassContainerProps<T>) {
  // `tag` prop이 없으면 제네릭의 기본값('div')을 따르도록 합니다.
  const Tag = tag || "div";

  const GlassComponent = glass[Tag as keyof typeof glass];

  if (!GlassComponent) {
    console.warn(`GlassContainer: '${String(Tag)}'는 유효한 태그가 아닙니다.`);
    // 타입스크립트가 `rest`의 타입을 정확히 추론하기 어려우므로,
    // 이 예외적인 상황에서는 타입을 단언해줄 수 있습니다.
    return (
      <glass.div
        className={className}
        {...(rest as ComponentPropsWithoutRef<"div">)}
      >
        {children}
      </glass.div>
    );
  }

  // `rest` 객체는 이제 T에 해당하는 속성들만 포함하므로 타입이 안전합니다.
  return (
    <GlassComponent className={className} {...rest}>
      {children}
    </GlassComponent>
  );
}

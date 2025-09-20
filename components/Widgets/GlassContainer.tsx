// components/GlassContainer.tsx (수정)

"use client";

import glass from "@/atoms/Glass";
import { PropsWithChildren, ElementType } from "react";

// 'as' prop을 포함하여 모든 HTML 속성을 받을 수 있도록 타입을 확장합니다.
interface GlassContainerProps {
  tag?: ElementType;
  className?: string;
  [key: string]: any; // href, onClick 등 나머지 모든 속성을 허용
}

export default function GlassContainer({
  // 1. 'as' prop을 받고, 기본값을 'div'로 설정합니다.
  //    받은 prop의 이름을 'Tag'로 변경하여 사용합니다.
  tag: Tag = "div",
  children,
  className,
  // 2. 나머지 모든 props를 'rest' 객체로 받습니다.
  ...rest
}: PropsWithChildren<GlassContainerProps>) {
  // 3. 'Tag' 이름에 해당하는 컴포넌트를 glass 팩토리에서 가져옵니다.
  const GlassComponent = glass[Tag as string];

  // 혹시라도 유효하지 않은 태그가 들어올 경우를 대비한 방어 코드
  if (!GlassComponent) {
    console.warn(`GlassContainer: '${String(Tag)}'는 유효한 태그가 아닙니다.`);
    // 기본 태그인 div로 렌더링합니다.
    return (
      <glass.div className={className} {...rest}>
        {children}
      </glass.div>
    );
  }

  // 4. 동적으로 선택된 컴포넌트를 렌더링하고, 나머지 props를 전달합니다.
  return (
    <GlassComponent className={className} {...rest}>
      {children}
    </GlassComponent>
  );
}

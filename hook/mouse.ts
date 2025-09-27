import { useEffect, useReducer } from "react";
import { switcher } from "@/lib/switcher";

interface MouseData {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
  behavior: State;
  elementX?: number; // [추가] 호버된 요소의 기준 X 좌표
  elementY?: number; // [추가] 호버된 요소의 기준 Y 좌표
}

// 공통 타입 정의
type Coordinates = { x: number; y: number };

// 2. Action 타입의 각 'type' 프로퍼티가 StateType의 일부임을 명시
type Action =
  | { type: "MOVE"; payload: Coordinates }
  | { type: "HOVER"; payload: Coordinates & { rect: DOMRect; radius: string; } }
  | { type: "LEAVE"; payload: Coordinates };

type State = Action['type']; // 결과: "MOVE" | "HOVER" | "LEAVE"

const initialState: MouseData = {
  x: -100,
  y: -100,
  width: 20,
  height: 20,
  radius: "50%",
  behavior: "MOVE"
};

export function useMouse() {
  const cursorReducer = (state: MouseData, action: Action): MouseData => {
    const REPULSION_FACTOR = 0.3;

    return switcher<Action, MouseData>(action)
      .case(
        (v) => v.type === "MOVE",
        (act) => {
          if (state.behavior === "HOVER" && state.elementX !== undefined && state.elementY !== undefined) {
            // 요소의 중심점
            const elementCenterX = state.elementX + state.width / 2;
            const elementCenterY = state.elementY + state.height / 2;

            // 마우스와 요소 중심 사이의 거리 벡터
            const deltaX = act.payload.x - elementCenterX;
            const deltaY = act.payload.y - elementCenterY;

            // 반발력이 적용된 새로운 커서 위치
            const repelledX = elementCenterX + deltaX * REPULSION_FACTOR;
            const repelledY = elementCenterY + deltaY * REPULSION_FACTOR;

            return { ...state, x: repelledX, y: repelledY };
          }
          return {
            ...state,
            x: act.payload.x,
            y: act.payload.y,
            behavior: "MOVE"
          };
        },
      )
      .case(
        (v) => v.type === "HOVER",
        (act) => {
          const { rect, radius } = act.payload;
          return {
            ...state,
            x: act.payload.x,
            y: act.payload.y,
            width: rect.width,
            height: rect.height,
            radius,
            behavior: "HOVER",
            elementX: rect.left,
            elementY: rect.top,
          };
        },
      )
      .case(
        (v) => v.type === "LEAVE",
        (act) => {
          return {
            ...state,
            width: 20,
            height: 20,
            x: act.payload.x,
            y: act.payload.y,
            radius: "50%",
            behavior: "MOVE",
            elementX: undefined,
            elementY: undefined,
          };
        },
      )
      .default(() => state);
  }

  const [state, dispatch] = useReducer(cursorReducer, initialState);

  useEffect(() => {
    // 역할 1: 마우스 포인터의 위치를 추적 (MOVE)
    const onMouseMove = (e: MouseEvent) => {
      dispatch({ type: "MOVE", payload: { x: e.clientX, y: e.clientY } });
    };

    // 역할 2: 인터랙티브 요소 위로 진입하는 것을 감지 (HOVER)
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest("[data-cursor-interactive]");

      if (interactiveElement) {
        const rect = interactiveElement.getBoundingClientRect();
        const { borderRadius } =
          window.getComputedStyle(interactiveElement);
        console.log(borderRadius)
        dispatch({ type: "HOVER", payload: { rect, radius: borderRadius, x: e.clientX, y: e.clientY } });
      }
    };

    // 역할 3: 인터랙티브 요소에서 이탈하는 것을 감지 (LEAVE)
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest("[data-cursor-interactive]");

      if (interactiveElement) {
        dispatch({ type: "LEAVE", payload: { x: e.clientX, y: e.clientY } });
      }
    };

    // 3개의 이벤트 리스너를 각각 등록
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    // 컴포넌트가 언마운트될 때 모든 리스너를 깨끗하게 제거
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  });

  return state
}

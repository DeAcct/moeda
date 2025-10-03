// hooks/useLiquidGlass.js

import { useCallback, useEffect, useRef, useState } from "react";

interface DisplacementAttr {
  height: number;
  width: number;
  radius: number;
  depth: number;
}
/**
 * Displacement map SVG를 data URL로 생성
 */
const getDisplacementMap = ({
  height,
  width,
  radius,
  depth,
}: DisplacementAttr) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><style>.mix { mix-blend-mode: screen; }</style><defs><linearGradient id="Y" x1="0" x2="0" y1="${Math.ceil((radius / height) * 15)}%" y2="${Math.floor(100 - (radius / height) * 15)}%"><stop offset="0%" stop-color="#0F0" /><stop offset="100%" stop-color="#000" /></linearGradient><linearGradient id="X" x1="${Math.ceil((radius / width) * 15)}%" x2="${Math.floor(100 - (radius / width) * 15)}%" y1="0" y2="0"><stop offset="0%" stop-color="#F00" /><stop offset="100%" stop-color="#000" /></linearGradient></defs><rect x="0" y="0" height="${height}" width="${width}" fill="#808080" /><g filter="blur(2px)"><rect x="0" y="0" height="${height}" width="${width}" fill="#000080" /><rect x="0" y="0" height="${height}" width="${width}" fill="url(#Y)" class="mix" /><rect x="0" y="0" height="${height}" width="${width}" fill="url(#X)" class="mix" /><rect x="${depth}" y="${depth}" height="${height - 2 * depth}" width="${width - 2 * depth}" fill="#808080" rx="${radius}" ry="${radius}" filter="blur(${depth}px)" /></g></svg>`,
  );

interface LiquidAttr {
  radius: number;
  depth: number;
  strength: number;
  chroma: number;
}
export function useLiquidGlass({
  radius: overrideRadius,
  depth: overrideDepth,
  strength = 100,
  chroma = 0,
}: LiquidAttr) {
  const [filterUrl, setFilterUrl] = useState("");
  const targetRef = useRef<HTMLElement | null>(null);


  // rebuild 함수를 useCallback으로 감싸서 불필요한 재생성을 방지합니다.
  const rebuild = useCallback(() => {
    const el = targetRef.current;
    if (!el) {
      setFilterUrl("");
      return;
    }
    const parsePx = (v: string) => {
      const m = /^([\d.]+)px$/.exec(v);
      return m ? parseFloat(m[1]) : 0;
    };

    const rect = el.getBoundingClientRect();
    const computed = getComputedStyle(el);

    const width = rect.width || parsePx(computed.width) || 0;
    const height = rect.height || parsePx(computed.height) || 0;

    let radius = 0;
    if (overrideRadius != null) {
      radius = overrideRadius;
    } else if (computed.borderRadius) {
      const parts = computed.borderRadius
        .split(/\s+/)
        .map((v) => parsePx(v))
        .filter((n) => !isNaN(n));
      if (parts.length) radius = Math.max(...parts);
    }

    const defaultDepth = Math.max(1, Math.min(width, height) * 0.05);
    const depth = overrideDepth != null ? overrideDepth : defaultDepth;

    if (width <= 0 || height <= 0) {
      setFilterUrl("");
      return;
    }

    const displacementMapHref = getDisplacementMap({
      height,
      width,
      radius,
      depth,
    });

    const svgFilter = `<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="displace" color-interpolation-filters="sRGB"><feImage x="0" y="0" height="${height}" width="${width}" href="${displacementMapHref}" result="displacementMap" /><feDisplacementMap transform-origin="center" in="SourceGraphic" in2="displacementMap" scale="${strength + chroma * 2}" xChannelSelector="R" yChannelSelector="G" /><feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="displacedR" /><feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength + chroma}" xChannelSelector="R" yChannelSelector="G" /><feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="displacedG" /><feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="${strength}" xChannelSelector="R" yChannelSelector="G" /><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="displacedB" /><feBlend in="displacedR" in2="displacedG" mode="screen" /><feBlend in2="displacedB" mode="screen" /></filter></defs></svg>`;

    const newFilterUrl =
      "data:image/svg+xml;utf8," + encodeURIComponent(svgFilter) + "#displace";
    setFilterUrl(newFilterUrl);
  }, [overrideRadius, overrideDepth, strength, chroma]);

  // useEffect를 사용하여 컴포넌트 마운트/언마운트 시 옵저버를 설정/해제합니다.
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    // 옵션이 변경될 때마다 rebuild를 다시 실행합니다. (Vue의 watchEffect 역할)
    rebuild();

    // DOM 요소의 크기나 스타일 변경을 감지하여 필터를 재생성합니다.
    const resizeObs = new ResizeObserver(rebuild);
    resizeObs.observe(el);

    const styleObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          (m.attributeName === "style" || m.attributeName === "class")
        ) {
          rebuild();
          break;
        }
      }
    });
    styleObserver.observe(el, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Cleanup 함수: 컴포넌트가 언마운트될 때 옵저버 연결을 해제합니다.
    return () => {
      resizeObs.disconnect();
      styleObserver.disconnect();
    };
  }, [rebuild]); // rebuild 함수가 변경될 때마다 이 effect를 재실행합니다.

  return {
    ref: targetRef,
    style: { backdropFilter: filterUrl ? `url("${filterUrl}") blur(0.3rem)` : "none" },
  };
}

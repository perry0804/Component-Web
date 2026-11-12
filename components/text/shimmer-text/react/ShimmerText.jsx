import React, { useEffect, useRef } from "react";

/**
 * ShimmerText 流光文字组件 (支持鼠标移入定位、跟随移动、移出原地续播)
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 文字内容
 * @param {'loop' | 'bounce'} [props.mode='loop'] - 'loop' 单向循环扫光 | 'bounce' 左右往返扫光
 * @param {string} [props.baseColor='#6b6661'] - 文字默认底色
 * @param {string} [props.highlightColor='#58a6ff'] - 高亮流光颜色
 * @param {number} [props.spread=14] - 高亮光斑半径百分比
 * @param {number} [props.speed] - 自动扫光速度（每秒移动百分比，默认 loop:58 / bounce:52）
 * @param {boolean} [props.interactive=true] - 是否启用鼠标移入锁定与跟随
 * @param {string} [props.className=''] - 自定义类名
 * @param {React.CSSProperties} [props.style] - 自定义行内样式
 */
export default function ShimmerText({
  children,
  mode = "loop",
  baseColor = "#6b6661",
  highlightColor = "#58a6ff",
  spread = 14,
  speed,
  interactive = true,
  className = "",
  style = {},
}) {
  const elRef = useRef(null);
  const stateRef = useRef({
    currentX: 0,
    direction: 1,
    isHovering: false,
    lastTime: 0,
  });

  const resolvedSpeed = speed ?? (mode === "loop" ? 58 : 52);

  const setShimmerX = (x) => {
    if (elRef.current) {
      elRef.current.style.setProperty("--shimmer-x", `${x.toFixed(2)}%`);
    }
  };

  const getMousePercent = (e) => {
    const el = elRef.current;
    if (!el) return 50;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return 50;
    const ratio = (e.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, ratio)) * 100;
  };

  const handleMouseEnter = (e) => {
    if (!interactive) return;
    const s = stateRef.current;
    s.isHovering = true;
    s.currentX = getMousePercent(e);
    setShimmerX(s.currentX);
  };

  const handleMouseMove = (e) => {
    if (!interactive || !stateRef.current.isHovering) return;
    const s = stateRef.current;
    const nextX = getMousePercent(e);
    const delta = nextX - s.currentX;
    if (Math.abs(delta) > 0.2) {
      s.direction = delta > 0 ? 1 : -1;
    }
    s.currentX = nextX;
    setShimmerX(s.currentX);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    const s = stateRef.current;
    s.isHovering = false;
    s.lastTime = performance.now();
    if (mode === "loop") {
      s.direction = 1;
    }
  };

  useEffect(() => {
    let rafId;
    stateRef.current.lastTime = performance.now();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const tick = (now) => {
      const s = stateRef.current;
      const dt = (now - s.lastTime) / 1000;
      s.lastTime = now;

      // 减少动态效果时：停止自动扫光，仅保留鼠标跟随
      if (!s.isHovering && !reduceMotion.matches) {
        const minX = -spread;
        const maxX = 100 + spread;
        const range = maxX - minX;

        s.currentX += s.direction * resolvedSpeed * dt;

        if (mode === "loop") {
          if (s.currentX > maxX) {
            s.currentX = minX + ((s.currentX - maxX) % range);
          }
        } else {
          if (s.currentX >= maxX) {
            s.currentX = maxX;
            s.direction = -1;
          } else if (s.currentX <= minX) {
            s.currentX = minX;
            s.direction = 1;
          }
        }

        setShimmerX(s.currentX);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mode, spread, resolvedSpeed]);

  return (
    <div
      ref={elRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        "--shimmer-x": "50%",
        lineHeight: 1.5,
        padding: "4px 0",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: interactive ? "pointer" : "default",
        userSelect: "none",
        color: "transparent",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        backgroundImage: `linear-gradient(
          90deg,
          ${baseColor} 0%,
          ${baseColor} calc(var(--shimmer-x) - ${spread}%),
          ${highlightColor} var(--shimmer-x),
          ${baseColor} calc(var(--shimmer-x) + ${spread}%),
          ${baseColor} 100%
        )`,
        backgroundSize: "100% 100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

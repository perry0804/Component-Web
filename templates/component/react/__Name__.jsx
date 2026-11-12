import React, { useEffect, useRef } from 'react';

/**
 * {{Name}} {{title}}
 *
 * @param {object} props
 * @param {React.ReactNode} [props.children] - 内容
 * @param {string} [props.example=''] - 示例参数
 * @param {string} [props.className=''] - 自定义类名
 * @param {React.CSSProperties} [props.style] - 自定义行内样式
 */
export default function {{Name}}({
  children,
  example = '',
  className = '',
  style = {},
}) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    // TODO: 启动动画 / 绑定事件

    return () => {
      // TODO: 清理 rAF / 事件监听 / Observer
    };
  }, [example]);

  return (
    <div ref={elRef} className={className} style={style}>
      {children ?? '{{title}}'}
    </div>
  );
}

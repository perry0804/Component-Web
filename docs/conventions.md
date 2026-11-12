# 编码与动效规范

## 命名

| 对象 | 规则 | 示例 |
| --- | --- | --- |
| 组件目录 / slug | kebab-case | `magnetic-button` |
| 组件名 / React 文件 | PascalCase | `MagneticButton.jsx` |
| Web Component 标签 | kebab-case，至少一个连字符，与 slug 一致 | `<magnetic-button>` |
| Web Component 属性 | kebab-case | `highlight-color` |
| CSS 变量 | `--<slug>-<name>` 或组件内部短名 | `--magnetic-button-strength` |
| CSS 类名 | 以 slug 为前缀 | `.magnetic-button__inner` |

## 代码风格

- 2 空格缩进、LF 换行、UTF-8（见 `.editorconfig`）。
- 注释使用中文，标识符使用英文。
- 组件顶部用 JSDoc 写清楚：组件作用 + 全部参数（类型、默认值、含义）。
- 可调参数优先暴露为：Props / Attributes → CSS 变量，避免写死魔法数字。
- 不依赖全局样式；Web Component 优先使用 Shadow DOM 隔离样式，并通过 `part` 暴露可定制节点。

## 动画性能

1. **只动画合成层属性**：优先 `transform`、`opacity`、`filter`；避免动画 `width/height/top/left/margin`。
2. **rAF 统一驱动**：连续动画用 `requestAnimationFrame`，并以 `dt`（时间差）计算位移，保证不同刷新率下速度一致。
3. **读写分离**：在同一帧中先读布局（`getBoundingClientRect`）再写样式，避免强制同步布局。
4. **驱动 CSS 变量**：JS 只更新 CSS 变量（如 `--x`），由 CSS 负责渲染，减少 DOM 操作。
5. **离屏暂停**：持续性动画应结合 `IntersectionObserver` 或 `document.visibilityState` 在不可见时暂停。
6. **资源释放**：卸载时必须清理 rAF、事件监听、`ResizeObserver` / `IntersectionObserver`、定时器。

## 无障碍（a11y）

- **尊重 `prefers-reduced-motion`**：用户开启"减少动态效果"时，关闭或弱化持续动画。

  ```css
  @media (prefers-reduced-motion: reduce) {
    .xxx { animation: none; transition: none; }
  }
  ```

  ```js
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  ```

- 纯装饰元素加 `aria-hidden="true"`；可交互元素保持可键盘聚焦并有可见的 `:focus-visible` 样式。
- 动画文字（如 `background-clip: text`）确保在不支持时仍有可读的回退颜色。
- 仅鼠标交互的效果需考虑触屏设备（`(hover: hover)` 媒体查询或 Pointer Events）。

## 兼容性

- 目标：最新两个版本的 Chrome / Safari / Firefox / Edge。
- 使用较新特性（View Transitions、Scroll-driven Animations、`@property`、Anchor Positioning 等）时，在 README「注意事项」中注明并给出降级方案。

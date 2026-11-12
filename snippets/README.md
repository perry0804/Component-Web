# snippets · 代码片段

太小、不足以成为一个"组件"的实用代码：一段 CSS 技巧、一个 Hook、一个工具函数。

```text
snippets/
├── css/      # CSS 技巧：渐变边框、毛玻璃、文字描边、滚动条美化……
├── js/       # 原生 JS 工具：节流防抖、缓动函数、Observer 封装……
└── react/    # React Hooks：useMousePosition、useInView、useReducedMotion……
```

## 约定

- **单文件**、通常 < 50 行，不需要 `meta.json` 和 `demo.html`。
- 文件名 kebab-case（React Hook 用 camelCase，如 `useInView.js`）。
- 文件顶部用注释写明：**作用 + 用法示例 + 来源（如有）**。

```js
/**
 * 缓动函数：easeOutExpo
 * 用法：const v = easeOutExpo(t) // t ∈ [0, 1]
 * 来源：https://easings.net/#easeOutExpo
 */
export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
```

- 当一个片段开始需要演示页、多个参数或多种实现时，把它升级为 `components/` 下的正式组件。

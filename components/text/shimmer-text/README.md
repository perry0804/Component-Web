# ShimmerText · 流光文字

> 文字表面持续扫过一道高光，鼠标移入时光斑锁定并跟随指针，移出后从当前位置继续播放。适合 AI "生成中 / 思考中"这类状态提示。

**状态**：`stable` ｜ **分类**：`text` ｜ **实现**：vanilla（Web Component）/ react

## 效果

- **自动扫光**：高光从左向右循环扫过（`loop`），或左右往返（`bounce`）。
- **鼠标移入**：光斑瞬间定位到指针所在位置并停止自动播放。
- **鼠标移动**：光斑跟随指针横向移动，同时记录移动方向。
- **鼠标移出**：从当前位置继续自动播放；`bounce` 模式沿最后的移动方向继续，`loop` 模式恢复向右。
- 文字单行显示，超出部分省略号截断。

## 使用

### Vanilla（Web Component）

```html
<script src="./vanilla/shimmer-text.js"></script>

<shimmer-text mode="bounce" highlight-color="#f59e0b">
  Generating response...
</shimmer-text>
```

### React

```jsx
import ShimmerText from './react/ShimmerText';

<ShimmerText mode="bounce" highlightColor="#f59e0b">
  Generating response...
</ShimmerText>
```

## 参数

| Prop（React） | Attribute（Vanilla） | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `mode` | `mode` | `'loop' \| 'bounce'` | `'loop'` | 单向循环 / 左右往返 |
| `baseColor` | `base-color` | `string` | `#6b6661` | 文字底色 |
| `highlightColor` | `highlight-color` | `string` | `#58a6ff` | 高光颜色 |
| `spread` | `spread` | `number` | `14` | 光斑半径（占文字宽度的百分比） |
| `speed` | `speed` | `number` | loop `58` / bounce `52` | 自动扫光速度（每秒移动的百分比） |
| `interactive` | `interactive` | `boolean` / `"true" \| "false"` | `true` | 是否启用鼠标锁定与跟随 |
| `className` / `style` | — | — | — | React 自定义类名与行内样式 |

Vanilla 版本可通过 `::part(text)` 定制内部文字容器样式。

## 实现要点

1. **`background-clip: text` + 线性渐变**：文字颜色透明，背景是"底色 → 高光 → 底色"的渐变，渐变中心由 CSS 变量 `--shimmer-x` 控制。
2. **rAF 驱动 CSS 变量**：每帧只更新 `--shimmer-x`，速度按 `dt` 计算，与刷新率无关。
3. **扫光范围为 `[-spread, 100 + spread]`**：保证光斑完全移出文字后才折返 / 重置，避免边缘突变。
4. **状态存 ref / 实例属性**：React 版用 `useRef` 存动画状态，避免每帧触发重渲染。

## 注意事项 / 待改进

- [x] `prefers-reduced-motion: reduce` 时停止自动扫光，仅保留鼠标跟随
- [ ] `spread="0"` 会因 `Number(x) || 14` 回退为默认值
- [ ] 不可见时（离屏 / 标签页隐藏）rAF 仍在运行，可结合 `IntersectionObserver` 暂停
- [ ] 触屏设备无 hover，可考虑支持 Pointer Events 拖动

## 来源

- 类型：原创
- 作者：perry0804
- 许可证：MIT

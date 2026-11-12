# 组件规范（Component Spec）

## 1. 目录结构

```text
components/<category>/<slug>/
├── README.md           # 必需：组件说明
├── meta.json           # 必需：元数据（索引、画廊依赖它）
├── demo.html           # 必需：零构建演示，双击即可打开
├── preview.png|gif     # 可选：静态预览图（画廊优先用 iframe 实时预览）
├── vanilla/            # 可选：原生 JS / Web Component 实现
│   └── <slug>.js
├── react/              # 可选：React 实现
│   └── <Name>.jsx | <Name>.tsx
├── vue/                # 可选：Vue 实现
│   └── <Name>.vue
├── css/                # 可选：纯 CSS 实现
│   └── <slug>.css
└── assets/             # 可选：组件自带的图片、字体、着色器等
```

- `<category>`：必须是 [categories.md](./categories.md) 中的合法分类。
- `<slug>`：kebab-case，全库唯一，如 `shimmer-text`、`magnetic-button`。
- `<Name>`：PascalCase，与 `meta.json.name` 一致，如 `ShimmerText`。
- 至少需要一种实现目录（`vanilla` / `react` / `vue` / `css` / `svelte` …）。

## 2. `meta.json` 字段

```json
{
  "name": "ShimmerText",
  "slug": "shimmer-text",
  "title": "流光文字",
  "category": "text",
  "description": "一句话描述效果与适用场景。",
  "tags": ["shimmer", "gradient", "hover"],
  "status": "stable",
  "implementations": ["vanilla", "react"],
  "dependencies": [],
  "source": {
    "type": "original",
    "url": "",
    "author": "",
    "license": ""
  },
  "createdAt": "2026-11-12",
  "updatedAt": "2026-11-12"
}
```

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| `name` | ✅ | PascalCase 组件名 |
| `slug` | ✅ | 与文件夹名一致 |
| `title` | ✅ | 中文名称 |
| `category` | ✅ | 与父目录名一致 |
| `description` | ✅ | 一句话描述 |
| `tags` | ✅ | 小写英文关键词数组，用于搜索（可为空数组） |
| `status` | ✅ | `idea` / `wip` / `stable` |
| `implementations` | ✅ | 实际存在的实现目录名数组；`idea` 状态可为空 |
| `dependencies` | ⬜ | 第三方依赖，如 `["gsap@3"]`、`["react@>=18"]` |
| `source.type` | ✅ | `original` 原创 / `adapted` 改编 / `reference` 仅参考未实现 |
| `source.url` | 条件 | `adapted` / `reference` 时必填 |
| `source.author` | ⬜ | 原作者 |
| `source.license` | 条件 | `adapted` 时必填，如 `MIT` |
| `createdAt` / `updatedAt` | ✅ | `YYYY-MM-DD` |

## 3. `README.md` 结构

按模板 [templates/component/README.md](../templates/component/README.md) 填写，至少包含：

1. **标题 + 一句话描述 + 状态**
2. **效果**：文字描述交互细节（鼠标移入 / 移出 / 滚动时分别发生什么）
3. **使用**：每种实现的最小用法代码
4. **参数**：Props / Attributes / CSS 变量表格
5. **实现要点**：核心原理（如"rAF 驱动 CSS 变量 + background-clip: text"）
6. **注意事项 / 待改进**：兼容性、性能、已知问题
7. **来源**

## 4. `demo.html` 要求

- 双击即可打开（`file://`）：本地脚本用普通 `<script src>` 引入，不使用 `type="module"` 加载本地文件。
- 展示 **默认效果 + 主要参数变体**。
- 默认深色背景（与画廊风格统一），页面本身不引入额外 UI 框架。
- React / Vue 实现如需演示，可在 demo 中通过 CDN（如 `https://esm.sh/react`）加载，不强制。

## 5. 实现约定

- **vanilla**：优先封装为 Web Component（`customElements.define`），并使用 `if (!customElements.get(tag))` 防止重复注册；以普通脚本形式书写，保证可被 `<script src>` 直接加载。
- **react**：函数组件 + Hooks，默认导出；所有副作用在 cleanup 中释放；参数用 JSDoc 或 TS 类型注释。
- **css**：样式以组件 slug 作为类名前缀，可调参数暴露为 CSS 变量（`--<slug>-xxx`）。

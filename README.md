# Component Web

[![CI](https://github.com/perry0804/Component-Web/actions/workflows/ci.yml/badge.svg)](https://github.com/perry0804/Component-Web/actions/workflows/ci.yml)
[![Pages](https://github.com/perry0804/Component-Web/actions/workflows/pages.yml/badge.svg)](https://perry0804.github.io/Component-Web/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> 个人 Web 组件收藏库 —— 收集日常**发现、整理、开发、参考**过的优秀 Web 组件。
> 不限于交互动画，任何"值得成为一个组件"的东西都可以放进来：按钮、文字特效、背景、光标、卡片、加载、滚动驱动、3D、表单控件……

- 🖼 **在线画廊**：<https://perry0804.github.io/Component-Web/>
- 📚 **组件索引**：[CATALOG.md](./CATALOG.md)
- 💡 **记录灵感**：[新建 Issue → 组件灵感](https://github.com/perry0804/Component-Web/issues/new?template=component-idea.yml)（手机上看到好效果时随手记）

## 设计原则

1. **单组件自包含**：每个组件一个文件夹，代码、文档、演示、元数据都在里面，复制整个文件夹即可带走。
2. **零构建可预览**：每个组件的 `demo.html` 双击即可在浏览器打开，不依赖 npm / 打包工具。
3. **多实现并存**：同一个效果可以有 `vanilla`（原生 / Web Component）、`react`、`vue`、`css` 等多种实现。
4. **来源可追溯**：参考或改编的组件必须记录原始链接、作者与许可证。
5. **元数据驱动**：每个组件有 `meta.json`，由脚本自动生成总索引 [CATALOG.md](./CATALOG.md) 和可视化画廊 `index.html`。

## 目录结构

```text
Component Web/
├── README.md               # 本文件：项目介绍
├── AGENTS.md               # AI Agent 工作指南（Claude / Gemini / Codex 等通用）
├── CLAUDE.md               # 指向 AGENTS.md
├── CATALOG.md              # 组件总索引（脚本自动生成，勿手改）
├── index.html              # 组件画廊（脚本自动生成，双击打开）
├── LICENSE                 # MIT（改编组件遵循其原始许可证）
├── package.json            # 仅用于注册 npm scripts，无任何依赖
│
├── components/             # ★ 正式组件，按分类存放
│   └── <category>/<slug>/  #   单个组件，结构见 docs/component-spec.md
├── snippets/               # 代码片段：太小不足以成为组件的技巧（CSS trick / hook / util）
├── references/             # 外部参考：优秀站点、灵感收件箱、截图录屏
├── templates/component/    # 新组件模板（由脚本复制使用）
├── scripts/                # 零依赖 Node 脚本：新建组件、生成索引与画廊
├── docs/                   # 规范文档
├── scratch/                # （按需本地创建）草稿区，整个目录被 git 忽略，不上传、不进索引
├── .agents/skills/         # Agent 技能：收录组件、记录参考、移植实现
└── .github/                # CI 校验、Pages 部署、Issue / PR 模板
```

## 快速上手

```bash
# 新建组件（从模板复制）
npm run new -- <category> <slug> --title "中文名"
# 例：npm run new -- button magnetic-button --title "磁吸按钮"

# 校验所有 meta.json 并重新生成 CATALOG.md 与 index.html
npm run catalog

# 只校验不写文件
npm run check
```

> 不想用 npm 也可以直接 `node scripts/new-component.mjs ...` / `node scripts/build-catalog.mjs`。

## 组件生命周期

| 状态 | 含义 |
| --- | --- |
| `idea` | 只记录了灵感 / 参考链接，尚未实现 |
| `wip` | 正在开发或仍有已知问题 |
| `stable` | 可直接复制到项目中使用 |

完整流程见 [docs/workflow.md](./docs/workflow.md)。

## 文档索引

- [docs/component-spec.md](./docs/component-spec.md) —— 单个组件的目录结构与 `meta.json` 字段
- [docs/categories.md](./docs/categories.md) —— 分类体系
- [docs/conventions.md](./docs/conventions.md) —— 命名、代码、动画性能与无障碍规范
- [docs/workflow.md](./docs/workflow.md) —— 发现 → 记录 → 整理 → 开发 → 沉淀
- [references/sites.md](./references/sites.md) —— 优秀组件 / 动效站点清单

## GitHub 自动化

| 工作流 | 触发 | 作用 |
| --- | --- | --- |
| [ci.yml](./.github/workflows/ci.yml) | push / PR | 校验 `meta.json`，并检查 `CATALOG.md`、`index.html` 是否已同步 |
| [pages.yml](./.github/workflows/pages.yml) | push 到 `main` | 生成画廊并部署到 GitHub Pages |

> 首次启用 Pages：仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

## 提交约定

使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)，scope 为组件分类或模块：

```text
feat(text): 新增 shimmer-text 流光文字
fix(button): 修复 magnetic-button 移出后未复位
docs(references): 收录 3 个动效站点
chore(scripts): catalog 支持 svelte 实现
```

## 许可证

原创内容采用 [MIT](./LICENSE)。改编自第三方的组件遵循其 `meta.json` 中记录的原始许可证；`references/` 中的素材仅供个人参考。

# AGENTS.md

本文件是所有 AI Agent（Antigravity / Gemini / Claude / Codex / Cursor 等）在本仓库工作的统一指南。

## 项目定位

这是一个**个人 Web 组件收藏库**，不是一个需要发布的 npm 包。目标是：
- 把日常看到的优秀组件**快速记录**下来；
- 把值得复用的组件**整理成自包含、可直接复制使用**的形式；
- 让每个组件**双击 `demo.html` 就能看到效果**。

## 沟通与文档语言

- 与用户交流、所有 Markdown 文档、代码注释：**中文**。
- 代码标识符（变量、函数、组件名、文件名）：**英文**。

## 目录速览

| 路径 | 用途 | Agent 是否可改 |
| --- | --- | --- |
| `components/<category>/<slug>/` | 正式组件 | ✅ |
| `snippets/` | 小代码片段 | ✅ |
| `references/` | 外部参考与灵感收件箱 | ✅ |
| `templates/component/` | 新组件模板 | ⚠️ 仅在用户要求修改规范时 |
| `scripts/` | 新建 / 索引脚本 | ⚠️ 仅在用户要求时 |
| `docs/` | 规范文档 | ⚠️ 规范变更需同步模板与脚本 |
| `scratch/` | 用户本地草稿区（按需创建，整个目录被 git 忽略，不上传、无备份） | ❌ 除非用户明确要求，不要移动或删除其中文件 |
| `CATALOG.md`、`index.html` | 自动生成 | ❌ 禁止手改，运行 `npm run catalog` |
| `.github/` | CI、Pages 部署、Issue / PR 模板 | ⚠️ 仅在用户要求时 |

## 硬性规则

1. **单组件自包含**：组件之间禁止相互 import；共享逻辑请复制一份，或沉淀到 `snippets/` 后再复制。
2. **`demo.html` 必须支持 `file://` 直接打开**：
   - 本地脚本用普通 `<script src="./vanilla/xxx.js">` 引入，**不要**用 `type="module"` 引入本地文件（file:// 下会被 CORS 拦截）。
   - 第三方库可以走 CDN（如 `https://esm.sh/`、`https://unpkg.com/`）。
3. **默认零依赖**：不引入打包工具和 npm 依赖。确需动画库（GSAP / Motion / Three.js 等）时，在 `meta.json.dependencies` 中声明并在 demo 里用 CDN。
4. **来源必须可追溯**：参考或改编自外部的组件，`meta.json.source` 必须填写 `url`、`author`、`license`；许可证不允许复制的只记录为 `idea` 并自行重写实现。
5. **改了组件就更新元数据**：修改 `meta.json`（至少 `updatedAt`），然后运行 `npm run catalog`，确保无报错。
6. **动画规范**：必须清理 rAF / 监听器 / Observer；优先只动画 `transform` 与 `opacity`；尊重 `prefers-reduced-motion`。详见 [docs/conventions.md](./docs/conventions.md)。
7. **Git**：仓库远程为 `origin` → `https://github.com/perry0804/Component-Web.git`，主分支 `main`。
   - 用户要求时才 `commit`；**未经用户明确同意不要 `push`**，禁止 `force push`。
   - 提交信息使用 Conventional Commits，scope 为分类或模块，描述用中文，如 `feat(text): 新增 shimmer-text 流光文字`。
   - 提交前必须运行 `npm run catalog` 并一并提交 `CATALOG.md` / `index.html`（CI 会检查是否同步）。
8. **不要安装依赖**，除非用户明确要求。

## 常见任务 → 对应技能

| 用户说法 | 使用技能 |
| --- | --- |
| "收录 / 加一个组件"、贴了一段组件代码、"把这个效果做成组件" | [.agents/skills/add-component](./.agents/skills/add-component/SKILL.md) |
| "记一下这个链接 / 网站 / 截图"、"先存着以后再做" | [.agents/skills/record-reference](./.agents/skills/record-reference/SKILL.md) |
| "给 xx 组件补一个 React / Vue / 原生版本" | [.agents/skills/port-implementation](./.agents/skills/port-implementation/SKILL.md) |

## 常用命令

```bash
npm run new -- <category> <slug> --title "中文名"   # 从模板新建组件
npm run catalog                                      # 校验 + 生成 CATALOG.md / index.html
npm run check                                        # 仅校验
```

## 完成标准（Definition of Done）

一个组件被视为"收录完成"需满足：

- [ ] 位于 `components/<合法分类>/<kebab-case-slug>/`
- [ ] `meta.json` 字段完整，`slug` 与文件夹名一致，`category` 与父目录一致
- [ ] `README.md` 包含：效果描述、使用方式、参数表、实现要点、来源
- [ ] `demo.html` 双击可运行，展示主要参数变体
- [ ] 至少一种实现（`vanilla/`、`react/`、`vue/`、`css/` 之一），且 `meta.json.implementations` 与实际目录一致
- [ ] `npm run catalog` 通过

## 参考文档

- [docs/component-spec.md](./docs/component-spec.md) —— 组件结构与 `meta.json` 字段（**新建组件前必读**）
- [docs/categories.md](./docs/categories.md) —— 合法分类列表
- [docs/conventions.md](./docs/conventions.md) —— 编码与动画规范
- [docs/workflow.md](./docs/workflow.md) —— 收录流程

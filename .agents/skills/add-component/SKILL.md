---
name: add-component
description: >-
  Use this skill when the user wants to add / collect / develop a component in the Component Web
  library — e.g. pastes component code, shares a link or screenshot and says "收录 / 做成组件 / 加一个组件",
  or asks to migrate a draft from scratch/ into components/.
---

# 收录组件

把任意来源（自研代码、外部链接、截图描述、scratch 草稿）整理成符合规范的组件。

## 步骤

1. **读规范**：[docs/component-spec.md](../../../docs/component-spec.md)、[docs/categories.md](../../../docs/categories.md)。
2. **确定元信息**（不确定时向用户确认，不要猜）：
   - 分类 `category`（按"它是什么"归类）；
   - `slug`（kebab-case、含连字符、全库唯一，先 `ls components/*/` 查重）；
   - 中文名 `title`；
   - 来源：`original` / `adapted`（需 url + license）/ `reference`（仅记录，status=idea）。
   - 若外部代码许可证不明或不允许复制：**不要照抄**，只记录为 `idea` 或自行重写实现。
3. **生成骨架**：
   ```bash
   node scripts/new-component.mjs <category> <slug> --title "中文名" [--impl vanilla,react]
   ```
4. **实现**：
   - 优先写 `vanilla/<slug>.js`（Web Component，IIFE + `customElements.get` 防重复注册），它会被 `demo.html` 直接使用；
   - 再按用户需要补 `react/<Name>.jsx` 等，各实现的参数与行为保持一致；
   - 遵守 [docs/conventions.md](../../../docs/conventions.md)：清理副作用、只动画 transform/opacity、支持 `prefers-reduced-motion`。
5. **演示**：`demo.html` 展示默认效果 + 主要参数变体，确保 `file://` 可打开（本地脚本不用 `type="module"`）。
6. **文档**：按模板填写 `README.md`（效果、使用、参数表、实现要点、注意事项、来源），更新 `meta.json`（description、tags、status、implementations、updatedAt）。
7. **收尾**：
   - 若来自 `references/inbox.md`，把条目改为 `- [x] ... → components/<category>/<slug>`；
   - 若来自 `scratch/`，**不要删除原草稿**，告知用户可自行删除；
   - 运行 `npm run catalog`，必须 0 错误。

## 验证

- `npm run catalog` 输出 `0 个错误`；
- 用浏览器打开 `components/<category>/<slug>/demo.html` 确认效果（可用浏览器工具截图给用户）；
- 对照 [AGENTS.md](../../../AGENTS.md) 中的「完成标准」逐项检查。

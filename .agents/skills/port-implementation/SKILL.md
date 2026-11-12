---
name: port-implementation
description: >-
  Use this skill when the user asks to add another framework implementation (React / Vue / vanilla Web Component /
  pure CSS / Svelte) to an existing component in the Component Web library, e.g. "给 shimmer-text 补一个 Vue 版本".
---

# 移植实现

为已有组件新增一种框架实现，保证**行为与参数一致**。

## 步骤

1. 读取组件目录下的 `README.md`、`meta.json` 和现有实现，梳理：参数表、交互状态机、动画循环、清理逻辑。
2. 在组件目录下新建实现目录与文件：

   | 实现 | 路径 | 要点 |
   | --- | --- | --- |
   | vanilla | `vanilla/<slug>.js` | Web Component，IIFE + `customElements.get` 防重复注册，attribute 用 kebab-case |
   | react | `react/<Name>.jsx` | 函数组件默认导出；动画状态放 `useRef`；effect cleanup 释放资源 |
   | vue | `vue/<Name>.vue` | `<script setup>`；`onMounted` / `onBeforeUnmount` 成对 |
   | css | `css/<slug>.css` | 类名以 slug 为前缀，参数暴露为 CSS 变量 |
   | svelte | `svelte/<Name>.svelte` | `onMount` 返回清理函数 |

3. **参数命名映射**：React/Vue 用 camelCase prop，vanilla 用 kebab-case attribute，默认值保持一致；无法对齐的差异写进 README。
4. 更新 `README.md`：「使用」增加该实现的最小示例，参数表补充对应列。
5. 更新 `meta.json`：`implementations` 加入新目录名，`updatedAt` 改为今天；新增依赖写入 `dependencies`。
6. 运行 `npm run catalog`，必须 0 错误。

## 验证

- 新实现与原实现在相同参数下效果一致（vanilla 可直接用 demo.html 对比）；
- 检查卸载 / 销毁时无残留 rAF 与监听器。

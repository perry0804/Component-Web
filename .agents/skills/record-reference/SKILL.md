---
name: record-reference
description: >-
  Use this skill when the user shares a link, website, screenshot or idea for the Component Web library
  but only wants to save it for later ("记一下 / 先存着 / 收藏这个网站 / 以后做") rather than implement it now.
---

# 记录参考

低成本地把灵感存下来，不做实现。

## 判断放哪里

| 内容 | 位置 |
| --- | --- |
| 某个具体效果 / 组件的链接或描述 | [references/inbox.md](../../../references/inbox.md) 的「待整理」 |
| 一个整体优秀的组件库 / 教程站点 | [references/sites.md](../../../references/sites.md) 对应表格 |
| 截图 / 录屏文件 | `references/inspirations/YYYYMMDD-<关键词>.<ext>`，并在 inbox 条目中引用 |

## inbox 条目格式

```markdown
- [ ] YYYY-MM-DD [标题](链接) —— 一句话描述效果 #分类
```

- 日期用当天日期；分类取自 [scripts/categories.json](../../../scripts/categories.json)。
- 一句话描述要写"效果是什么"，而不是"网站是什么"，方便以后检索。
- 追加到「待整理」末尾，不要重排已有条目。

## 注意

- 如果用户同时提供了可用代码并希望收录，改用 `add-component` 技能。
- 不要下载受版权保护的整站资源；截图仅限用户提供的文件。
- sites.md 新增站点前先检查是否已存在。

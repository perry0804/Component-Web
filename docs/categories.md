# 分类体系

> 唯一数据源：[scripts/categories.json](../scripts/categories.json)。新增分类时**先改 JSON**，再同步本表，并在 `components/` 下建同名目录。

| ID（目录名） | 中文名 | 收录范围 |
| --- | --- | --- |
| `text` | 文字效果 | 流光、打字机、乱码解码、渐变文字、文字拆分动画 |
| `button` | 按钮 | 磁吸、涟漪、发光边框、按压反馈 |
| `background` | 背景氛围 | 极光、网格、粒子、噪点、渐变流动 |
| `cursor` | 光标与指针 | 自定义光标、跟随光斑、拖尾、聚光灯 |
| `card` | 卡片 | 3D 倾斜、悬停光效、翻转、玻璃拟态 |
| `navigation` | 导航 | 导航栏、菜单、Tabs、Dock、面包屑、分页 |
| `layout` | 布局容器 | Bento 网格、瀑布流、分栏、可拖拽面板 |
| `scroll` | 滚动驱动 | 视差、滚动进度、吸顶、跑马灯、滚动揭示 |
| `loader` | 加载与进度 | Spinner、骨架屏、进度条、占位动画 |
| `feedback` | 反馈浮层 | Toast、Modal、Tooltip、Popover、Drawer |
| `form` | 表单输入 | 输入框、开关、滑块、选择器、OTP、上传 |
| `data-display` | 数据展示 | 数字滚动、列表、表格、时间线、徽章、图表 |
| `media` | 媒体 | 图片对比、画廊、轮播、视频播放器、灯箱 |
| `transition` | 过渡转场 | 页面转场、View Transitions、共享元素、展开收起 |
| `3d` | 3D 与图形 | WebGL、Three.js、Canvas、Shader、SVG 生成艺术 |
| `misc` | 其他 | 暂时无法归类的组件 |

## 归类原则

1. **按"它是什么"而不是"它怎么动"归类**：一个带磁吸效果的按钮归 `button`，而不是 `cursor`。
2. **只选一个主分类**，其余特征写进 `tags`（如 `magnetic`、`hover`、`scroll`）。
3. 拿不准就先放 `misc`，某类累计 ≥3 个组件时再考虑新建分类。

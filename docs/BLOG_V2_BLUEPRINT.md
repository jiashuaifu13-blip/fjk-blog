# FJK Blog V2 改造指导蓝图

> 项目代号：**FJK Blog V2 — Anime Soft Tech**
>
> 项目目标：在保留现有 Astro 博客功能、SEO、内容结构和静态部署方式的基础上，对博客进行系统性的视觉、交互、阅读体验和功能升级，形成具有个人辨识度的二次元科技风博客。
>
> 当前原则：**先规划 → 分阶段实施 → 每阶段测试 → 最终统一验收与部署**

---

## 1. 文档用途

本文件是 FJK Blog V2 改造项目的长期指导蓝图。

后续所有视觉设计、组件重构、功能增加、测试和部署均以本文件为主要参考。

每完成一个阶段，应同步更新：

- 当前状态
- 已完成事项
- 遇到的问题
- 设计变更
- 测试结果
- 下一阶段计划

避免项目在长期迭代中出现：

- 重复修改
- 风格不统一
- 功能遗漏
- 临时方案越来越多
- 忘记之前做过什么
- 聊天记录丢失后无法继续

---

# 2. 项目现状

当前博客技术栈：

- Astro 7
- TypeScript
- Tailwind CSS 4
- Markdown / MDX
- Astro Content Collections
- Nginx 静态部署
- HTTPS
- 独立域名

生产地址：

`https://fjksp.cn`

当前已经具备：

- 首页
- 文章列表
- 动态文章页面
- 项目页面
- About 页面
- Archive 页面
- 分类页面
- 标签页面
- 自定义 404
- Markdown / MDX 内容
- Content Collections
- 草稿机制
- 分类与标签
- 文章封面
- 上一篇 / 下一篇
- 响应式布局
- 暗色模式
- 主题偏好持久化
- SEO metadata
- OpenGraph
- Twitter Card
- RSS
- Sitemap
- robots.txt
- HTTPS
- Nginx 静态部署

---

# 3. V2 核心目标

V2 不进行技术栈大换血。

核心策略：

> 保留当前稳定功能，对视觉层、组件层和用户体验层进行系统重构。

最终目标：

### 视觉

形成统一的：

**Anime Soft Tech**

设计语言。

关键词：

- 日系
- 二次元
- 清新
- 科技感
- 柔和
- 现代
- 卡片化
- 玻璃质感
- 阅读优先
- 克制动画

---

# 4. 设计参考项目

## Shirone

主要参考：

- 二次元氛围
- Hero 设计
- 页面层级
- 主题系统
- 长文阅读体验
- 动画细节

用途：

**视觉主参考**

---

## Firefly

主要参考：

- 二次元博客表现形式
- Banner
- 卡片
- 透明效果
- 主题色
- 移动端体验

用途：

**首页与卡片视觉参考**

---

## Fuwari

主要参考：

- Astro 博客架构
- 文章卡片
- Sidebar
- 搜索
- TOC
- 博客组件组织

用途：

**博客结构参考**

---

## AstroPaper

主要参考：

- 阅读体验
- SEO
- 可访问性
- 内容布局
- 性能

用途：

**质量底线参考**

---

## Astro Sumi

主要参考：

- 日式审美
- 留白
- 字体层级
- 克制动画

用途：

**视觉细节参考**

---

# 5. V2 视觉系统

## 5.1 亮色主题

整体感觉：

> 日系天空 + 奶白 + 樱花色

建议基础色：

背景：

- `#F8F9FF`
- `#FFF7FB`

主色：

- `#7C8CFF`
- `#9B8CFF`

辅助色：

- `#FF9FCF`
- `#8EDCFF`

正文：

- `#2D3142`

弱文字：

- `#6B7280`

---

## 5.2 暗色主题

整体感觉：

> 午夜动漫城市 + 紫蓝科技感

背景：

- `#10111A`
- `#151827`

主色：

- `#9EA8FF`

辅助色：

- `#FF9FD6`
- `#7DE3FF`

正文：

- `#EEF0FF`

弱文字：

- `#A8AEC7`

---

# 6. UI 设计规范

统一圆角：

- 小元素：10–12px
- 按钮：12–16px
- 卡片：18–24px
- Hero 大卡片：24–32px

统一动画时间：

- 快速交互：150ms
- 普通 hover：200–250ms
- 页面组件动画：300–500ms

卡片 hover：

- 轻微上浮
- 阴影增强
- 封面轻微放大

禁止：

- 过强发光
- 大量粒子
- 大量弹跳动画
- 影响阅读的背景动画
- 过多玻璃模糊

原则：

> 二次元氛围服务于内容，而不是盖过内容。

---

# 7. 首页规划

首页结构：

```text
Header

Hero
├─ Hello / 自我介绍
├─ 博客简介
├─ 主按钮
├─ 次按钮
└─ 原创主题插画

最新文章
├─ 主推荐文章
└─ 普通文章卡片

分类 / 标签入口

精选项目

最近更新

Footer
```

---

# 8. Hero 区规划

Hero 是整个 V2 最重要的视觉区域。

左侧：

- Hello, I'm FJK
- 简介
- 一句个人博客 Slogan
- 阅读文章按钮
- 关于我按钮

右侧：

- 原创二次元角色
或
- 原创主题插画

避免直接使用已有动漫作品角色作为博客核心视觉。

优先：

- 原创 AI 角色
- 自制角色
- 明确可商用 / 可修改素材

---

# 9. Header 规划

目标：

悬浮、轻量、半透明。

包含：

- Logo
- 首页
- 文章
- 项目
- 归档
- 关于
- 搜索
- 主题切换

桌面端：

横向导航。

移动端：

折叠菜单。

---

# 10. 文章列表页

目标：

提高文章浏览体验。

文章卡片包含：

- 封面
- 标题
- Description
- 日期
- Category
- Tags

桌面：

主内容区 + 可选侧栏。

移动端：

单列。

---

# 11. 文章详情页

文章页原则：

> 阅读体验优先于视觉特效。

正文宽度：

约 720–800px。

建议：

- 行高约 1.8
- 正文字号 16–18px
- 清晰 H1 / H2 / H3
- 优化 blockquote
- 优化列表
- 优化表格
- 优化图片
- 优化代码块

未来增加：

- TOC
- 阅读时间
- 评论
- 文章分享
- 上一篇 / 下一篇

---

# 12. 项目页

项目页改造成作品集风格。

每个项目：

- 项目名
- 项目简介
- 技术栈
- 状态
- 项目截图
- GitHub
- Demo

视觉：

卡片网格。

---

# 13. Archive

从普通文章列表升级成：

**年份时间轴**

例如：

```text
2026

● 11-09 我的第一篇博客文章
● 11-08 从零开始搭建我的个人博客

2025

● ...
```

---

# 14. About

设计成：

**二次元角色资料卡 + 开发者介绍**

包含：

- Avatar / Illustration
- FJK
- Developer / Student
- 简介
- 技术栈
- 兴趣
- Blog 介绍

---

# 15. 404 页面

主题：

> “好像迷路了。”

包含：

- 原创插画
- 404
- 返回首页
- 返回文章

避免复杂逻辑。

---

# 16. 搜索系统

计划：

**Pagefind**

原因：

- 静态
- 无数据库
- 与 Astro 非常适合
- 构建时生成索引
- 部署简单

状态：

`[ ] 未实施`

---

# 17. 代码块

计划：

**Expressive Code**

目标：

支持：

- 高质量代码高亮
- 文件标题
- diff
- 行高亮
- 多主题
- Copy 按钮

状态：

`[ ] 未实施`

---

# 18. 评论系统

计划：

**giscus**

使用：

GitHub Discussions。

优点：

- 无数据库
- 无独立后端
- GitHub 身份
- 开源
- 维护成本低

状态：

`[ ] 未实施`

---

# 19. 实施阶段

## Phase 0 — 项目蓝图

状态：

`[x] 进行中`

目标：

建立完整 V2 改造方案。

内容：

- 风格确定
- 页面确定
- 技术方案确定
- 测试策略确定

---

## Phase 1 — 视觉基础层

状态：

`[ ] 未开始`

修改重点：

- 全局 CSS
- Design Tokens
- 颜色
- 字体
- Border
- Shadow
- Radius
- 暗色模式

预计主要涉及：

`src/styles/global.css`

以及 Layout。

验收：

- Light / Dark 正常
- 原页面不崩
- CSS 无明显冲突

---

## Phase 2 — 公共组件

状态：

`[ ] 未开始`

主要组件：

- Header
- Footer
- Button
- Badge
- Card
- Theme Toggle

目标：

统一全站视觉语言。

---

## Phase 3 — 首页

状态：

`[ ] 未开始`

重构：

- Hero
- 最新文章
- Featured Post
- 分类
- 项目
- Footer

这是第一次完整视觉验收节点。

---

## Phase 4 — 内容页面

状态：

`[ ] 未开始`

重构：

- Blog
- Article
- Category
- Tag
- Archive

重点：

阅读体验。

---

## Phase 5 — About / Projects / 404

状态：

`[ ] 未开始`

完成所有辅助页面统一。

---

## Phase 6 — 搜索

状态：

`[ ] 未开始`

接入：

Pagefind。

---

## Phase 7 — 代码体验

状态：

`[ ] 未开始`

接入：

Expressive Code。

---

## Phase 8 — 评论

状态：

`[ ] 未开始`

接入：

giscus。

---

## Phase 9 — 动效与细节

状态：

`[ ] 未开始`

包括：

- hover
- entrance animation
- transition
- mobile menu
- cover zoom

原则：

控制性能影响。

---

## Phase 10 — 完整测试

状态：

`[ ] 未开始`

通过后才能部署。

---

# 20. 每阶段开发流程

任何阶段必须按照：

```text
规划
↓
确认修改文件
↓
完整备份
↓
修改
↓
npm run dev
↓
浏览器测试
↓
npm run build
↓
Git commit
↓
进入下一阶段
```

禁止：

一次性大规模修改十几个文件。

---

# 21. 源代码修改规则

后续所有代码修改遵守：

### 规则 1

如果修改已有源代码文件：

**提供完整文件内容。**

禁止仅提供局部 patch。

---

### 规则 2

每次只修改必要文件。

---

### 规则 3

任何大改前：

建议 Git commit。

---

### 规则 4

每完成阶段：

必须：

```bash
npm run build
```

成功后才能继续。

---

# 22. Git 建议

阶段提交示例：

```text
docs: add blog v2 redesign blueprint

style: establish anime soft tech design system

feat: redesign global header and navigation

feat: redesign homepage hero and article cards

feat: redesign blog reading experience

feat: add pagefind search

feat: add expressive code

feat: add giscus comments

style: refine anime theme animations

test: complete blog v2 regression testing
```

---

# 23. 测试计划

## 页面测试

必须检查：

- `/`
- `/blog`
- `/blog/[id]`
- `/projects`
- `/archive`
- `/about`
- `/blog/category/[category]`
- `/blog/tag/[tag]`
- `/404`

---

## 主题测试

检查：

- Light
- Dark
- 系统主题
- localStorage
- 页面刷新
- 页面跳转

---

## 响应式测试

至少：

- 375px
- 430px
- 768px
- 1024px
- 1440px

---

## 内容测试

检查：

- 中文
- 英文
- 长标题
- 长标签
- 图片
- Markdown
- MDX
- Code
- Quote
- Table
- List

---

## SEO 测试

检查：

- title
- description
- canonical
- OpenGraph
- Twitter Card
- robots
- RSS
- sitemap

---

## 构建测试

必须：

```bash
npm run build
```

无 Error。

---

# 24. 性能原则

尽量保持：

- 静态生成
- 少量 JS
- 图片优化
- 不引入大型 UI Framework
- 动画优先 CSS
- 避免过度 hydration

目标：

二次元视觉效果不能明显牺牲 Astro 的性能优势。

---

# 25. 暂不进行的事项

当前暂缓：

- 更换框架
- 引入数据库
- Docker 化博客
- CMS
- 用户系统
- 服务端 API
- 大型后台管理系统

原因：

当前个人静态博客没有必要增加这些复杂度。

---

# 26. 部署原则

生产环境继续：

Astro Static Build

↓

Nginx

↓

`https://fjksp.cn`

部署前必须：

```bash
npm run build
```

成功。

再上传：

`dist/`

---

# 27. 最终验收标准

V2 完成时应达到：

### 视觉

- 有明确个人风格
- 二次元氛围统一
- Light / Dark 完整
- 手机和桌面一致

### 内容

- 阅读舒适
- Markdown 完整
- 图片正常
- 代码可读

### 功能

- Search
- TOC
- Comments
- RSS
- Sitemap
- Categories
- Tags
- Archive

### 技术

- Astro build 成功
- 无明显控制台错误
- SEO 正常
- HTTPS 正常
- Nginx 正常

### 运维

- 静态部署简单
- 不增加不必要服务器组件
- 可通过 Git 回滚

---

# 28. 当前进度

当前：

```text
项目基础功能       ██████████ 100%
服务器部署         ██████████ 100%
HTTPS              ██████████ 100%
服务器基础安全     ██████████ 100%

V2 规划            ████████░░ 80%
视觉基础           ░░░░░░░░░░ 0%
组件重构           ░░░░░░░░░░ 0%
首页重构           ░░░░░░░░░░ 0%
内容页面           ░░░░░░░░░░ 0%
功能增强           ░░░░░░░░░░ 0%
完整测试           ░░░░░░░░░░ 0%
生产部署           ░░░░░░░░░░ 0%
```

---

# 29. 下一步

下一阶段：

## Phase 1 — Anime Soft Tech 视觉基础层

正式修改代码之前，需要最后确定：

1. 最终色板
2. 字体系统
3. Background 风格
4. Card 风格
5. Hero 风格
6. 原创二次元角色视觉方向
7. Light / Dark 对应关系

确认后：

开始修改：

`src/styles/global.css`

以及必要的 Layout / 公共组件。

---

# 30. 项目原则

最终坚持：

> 好看，但不过度设计。

> 二次元，但不影响阅读。

> 功能丰富，但不牺牲性能。

> 借鉴优秀项目，但不复制别人的博客。

> 最终形成属于 FJK 的博客设计语言。
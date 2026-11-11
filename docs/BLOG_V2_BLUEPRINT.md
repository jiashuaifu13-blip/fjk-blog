# FJK Blog V2 改造指导蓝图

> 项目代号：**FJK Blog V2 — Anime Soft Tech**
>
> 项目目标：在保留现有 Astro 博客功能、SEO、内容结构和静态部署方式的基础上，对博客进行系统性的视觉、交互、阅读体验和功能升级，形成具有个人辨识度的二次元科技风博客。
>
> 开发原则：**先规划 → 分阶段实施 → 每阶段测试 → Git 提交 → 最终统一验收与部署**

---

# 1. 文档用途

本文件是 FJK Blog V2 改造项目的长期指导蓝图。

后续所有：

- 视觉设计
- 页面重构
- 组件开发
- 功能增加
- 测试
- Git 提交
- 部署

均以本文件为主要参考。

每完成一个阶段，应同步更新：

- 当前状态
- 已完成事项
- 遇到的问题
- 设计变更
- 测试结果
- Git 提交
- 下一阶段计划

目标是避免长期开发过程中出现：

- 重复修改
- 风格不统一
- 功能遗漏
- 临时方案越来越多
- 忘记之前为什么这样设计
- 聊天记录丢失后无法继续
- 修改多个文件后无法定位问题
- 功能完成但文档仍然过时

---

# 2. 项目信息

## 项目名称

**FJK Blog**

## V2 项目代号

**FJK Blog V2 — Anime Soft Tech**

## 在线地址

https://fjksp.cn

## GitHub

https://github.com/jiashuaifu13-blip/fjk-blog

## GitHub 状态

仓库已公开。

当前主要分支：

```text
main
```

V2 开工前整理后的基线提交：

```text
763f382
```

---

# 3. 当前技术栈

当前博客使用：

- Astro 7
- TypeScript
- Tailwind CSS 4
- Markdown
- MDX
- Astro Content Collections
- Git
- Nginx

生产环境：

```text
Astro Static Build
        ↓
      Nginx
        ↓
https://fjksp.cn
```

生产服务器不需要运行 Node.js。

---

# 4. 当前已经具备的功能

目前已经完成：

- 首页
- 文章列表
- 动态文章页面
- 项目页面
- About 页面
- Archive 页面
- 分类页面
- 标签页面
- 自定义 404
- Markdown 内容
- MDX 支持
- Astro Content Collections
- 草稿机制
- 分类系统
- 标签系统
- 文章封面
- 上一篇 / 下一篇
- 响应式布局
- 亮色模式
- 暗色模式
- 系统主题检测
- localStorage 主题偏好持久化
- SEO metadata
- Canonical URL
- OpenGraph
- Twitter Card
- RSS
- Sitemap
- robots.txt
- HTTPS
- Nginx 静态部署
- GitHub 仓库
- 服务器基础安全加固

---

# 5. 当前服务器状态

服务器已经完成基础安全整理。

当前包括：

- SSH 密钥登录
- 禁止 root SSH
- 禁止 SSH 密码登录
- firewalld 已启用
- 公网仅开放 SSH / HTTP / HTTPS
- 22 / 80 / 443 正常
- MySQL 已停止
- MySQL 已取消开机自启
- rpcbind 已停止
- rpcbind.socket 已停止
- 111 / 3306 / 33060 不再监听
- Fail2ban 已启用
- Fail2ban 正在保护 sshd
- HTTPS 已启用

当前服务器主要监听：

```text
22
80
443
```

25 端口仅监听 localhost。

---

# 6. V2 核心目标

V2 不进行技术栈大换血。

核心策略：

> 保留当前稳定功能，对视觉层、组件层和用户体验层进行系统重构。

最终设计语言：

# Anime Soft Tech

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
- 响应式
- 高性能

---

# 7. V2 总体原则

## 原则 1

二次元氛围服务于内容，而不是盖过内容。

## 原则 2

文章阅读体验优先于首页视觉特效。

## 原则 3

不为了视觉效果牺牲 Astro 的静态性能优势。

## 原则 4

不引入没有必要的大型 UI Framework。

## 原则 5

尽量使用 CSS 动画。

## 原则 6

尽量减少客户端 JavaScript。

## 原则 7

每次只修改有限数量文件。

## 原则 8

每阶段完成后必须：

```text
npm run dev
↓
浏览器测试
↓
npm run build
↓
git diff
↓
git commit
↓
git push
```

---

# 8. 开源项目利用策略

V2 会研究多个优秀开源博客项目。

但原则不是：

> 复制别人的主题。

而是：

> 研究成熟设计 → 理解设计原因 → 用现有项目结构重新实现。

最终项目仍然是：

**FJK Blog**

而不是：

**某个开源主题换名字。**

---

# 9. Shirone

主要用途：

**整体视觉方向参考**

重点研究：

- Anime 风格氛围
- Hero 构图
- 页面层级
- 留白
- 配色关系
- 长文阅读体验
- 动效节奏
- 卡片层级
- 页面视觉节奏

不直接复制：

- 整套页面
- 整套组件系统
- 第三方角色素材

目标：

从 Shirone 学习：

> 如何让 Anime 风格看起来高级而不是杂乱。

---

# 10. Firefly

主要用途：

**二次元博客 UI 参考**

重点研究：

- Header
- Banner
- Article Card
- Sidebar
- Theme
- Responsive
- 透明卡片
- 移动端体验
- 页面层级

Firefly 与我们的目标非常接近。

但仍然采用：

```text
研究
↓
拆解
↓
重新实现
```

而不是整套迁移。

尤其不直接使用其受版权保护的角色素材。

---

# 11. Fuwari

主要用途：

**博客架构参考**

重点研究：

- Astro 博客组件组织
- 文章卡片
- Sidebar
- TOC
- 搜索
- 分类
- 标签
- 页面布局
- 响应式设计

主要解决：

> 一个成熟 Astro 博客应该如何组织页面和组件。

---

# 12. AstroPaper

主要用途：

**质量底线参考**

重点参考：

- 阅读体验
- SEO
- Accessibility
- Responsive
- RSS
- Sitemap
- Typography
- Content Layout

Anime 风格不能导致：

- SEO 退化
- 可访问性变差
- 手机端变差
- 文章难读

---

# 13. Astro Sumi

主要用途：

**日式审美参考**

重点研究：

- 留白
- Typography
- 日系视觉语言
- 动画克制
- 页面节奏
- 内容与背景关系

---

# 14. 真正计划集成的第三方功能

以下项目不是单纯视觉参考，而是后续计划真正加入项目。

---

## Pagefind

用途：

全文搜索。

原因：

- 静态搜索
- 不需要数据库
- 不需要后端
- 与 Astro 静态构建非常适合
- 可以直接随 dist 部署

状态：

```text
[ ] 未实施
```

---

## Expressive Code

用途：

增强技术文章代码块。

计划功能：

- Syntax Highlight
- 文件名
- Copy
- diff
- 行高亮
- 多主题
- 更好的阅读体验

状态：

```text
[ ] 未实施
```

---

## giscus

用途：

文章评论。

基于：

GitHub Discussions。

优点：

- 不需要数据库
- 不需要服务器后端
- GitHub 身份
- 开源
- 维护成本低

状态：

```text
[ ] 未实施
```

---

# 15. 当前 Content Schema

当前文章字段：

```text
title
description
date
category
tags
draft
cover
coverAlt
```

当前阶段足够使用。

未来可根据真实需求考虑：

```text
updatedDate
featured
comments
toc
```

暂时不提前增加。

---

# 16. V2 亮色主题方向

整体感觉：

> 日系天空 + 奶白 + 樱花色

基础方向：

```text
背景：
#F8F9FF
#FFF7FB

主色：
#7C8CFF
#9B8CFF

辅助色：
#FF9FCF
#8EDCFF

正文：
#2D3142

弱文字：
#6B7280
```

这些颜色只是初始规划。

Phase 1 会根据实际页面效果进一步调整。

---

# 17. V2 暗色主题方向

整体感觉：

> 午夜动漫城市 + 紫蓝科技感

基础方向：

```text
背景：
#10111A
#151827

主色：
#9EA8FF

辅助色：
#FF9FD6
#7DE3FF

正文：
#EEF0FF

弱文字：
#A8AEC7
```

要求：

- 不允许纯黑大面积压迫
- 保留层级
- 正文对比度足够
- 卡片与背景明显但柔和

---

# 18. Design Tokens 规划

Phase 1 将逐渐建立统一变量。

当前已有变量：

```text
--background
--surface
--surface-hover
--text-primary
--text-secondary
--border
--border-strong
--accent
--content-width
--article-width
```

未来逐步升级为：

```text
--color-bg
--color-bg-soft
--color-surface
--color-surface-elevated
--color-surface-glass

--color-primary
--color-primary-soft
--color-secondary

--color-pink
--color-cyan
--color-purple

--text-primary
--text-secondary
--text-muted

--border
--border-strong

--radius-sm
--radius-md
--radius-lg
--radius-xl

--shadow-sm
--shadow-card
--shadow-hover

--blur-glass

--content-width
--article-width
```

不会一次性无意义增加变量。

所有变量必须服务于真实组件。

---

# 19. UI 设计规范

统一圆角方向：

```text
小元素：
10–12px

按钮：
12–16px

普通卡片：
18–24px

Hero：
24–32px
```

统一动画时间：

```text
快速交互：
150ms

hover：
200–250ms

组件进入：
300–500ms
```

---

# 20. 卡片设计原则

卡片可能包含：

- 浅色 Surface
- 淡边框
- 柔和阴影
- 轻微透明
- 少量玻璃效果

Hover：

```text
translateY(-2px ~ -4px)
```

同时：

- Shadow 增强
- Border 增强
- Cover 轻微放大

禁止：

- 大幅度移动
- 过度发光
- 强烈 3D
- 大量 blur

---

# 21. 动画原则

允许：

- Fade
- Slide
- Small Scale
- Hover Lift
- Cover Zoom
- Navigation Transition

禁止：

- 全站大量粒子
- 每个元素都弹跳
- 持续闪烁
- 影响阅读的背景动画
- 大量 WebGL

原则：

> 让用户感受到细节，而不是被动画打扰。

---

# 22. 首页规划

首页未来结构：

```text
Header

Hero
├─ Greeting
├─ FJK
├─ Blog Slogan
├─ Primary CTA
├─ Secondary CTA
└─ Original Anime Illustration

Latest Articles
├─ Featured Article
└─ Article Cards

Categories / Tags

Featured Projects

Recent Updates

Footer
```

---

# 23. Hero 规划

Hero 是 V2 最重要的视觉区域。

左侧：

- Hello
- I'm FJK
- Blog Slogan
- 简介
- 阅读文章
- 关于我

右侧：

- 原创 Anime 角色
或
- 原创 Anime Soft Tech 插画

不直接使用：

- 动漫作品截图
- 已有商业角色作为博客核心视觉

优先：

- 原创角色
- 自制角色
- 自有版权素材
- 明确允许使用的素材

---

# 24. Header 规划

当前 Header：

桌面端可用。

移动端主要依赖：

```text
overflow-x: auto
```

V2 将改为真正的响应式导航。

桌面端：

```text
Logo
首页
文章
项目
归档
关于
搜索
主题切换
```

移动端：

```text
Logo
Theme Toggle
Menu Button
↓
Dropdown / Panel
```

目标：

- 不横向滚动导航
- 手机单手可操作
- 页面跳转清晰

---

# 25. Footer 规划

Footer 后续增加：

- Blog name
- Copyright
- GitHub
- RSS
- 当前年份
- 简短 Slogan

保持简单。

避免做成复杂第二导航。

---

# 26. 文章列表页规划

文章卡片包含：

- Cover
- Title
- Description
- Date
- Category
- Tags

桌面：

可考虑：

```text
Main Content
+
Optional Sidebar
```

移动端：

单列。

---

# 27. 文章详情页规划

文章页第一原则：

# 阅读体验优先

正文宽度：

```text
720px ~ 800px
```

正文：

```text
16px ~ 18px
```

Line Height：

```text
约 1.8
```

重点优化：

- H1
- H2
- H3
- Paragraph
- Link
- List
- Quote
- Code
- Table
- Image

---

# 28. 文章详情页未来功能

计划：

- TOC
- Reading Time
- Article Meta
- Category
- Tags
- Share
- Previous
- Next
- giscus Comments

---

# 29. Projects 页面规划

当前已经拥有真实项目：

```text
Personal Blog
```

GitHub：

https://github.com/jiashuaifu13-blip/fjk-blog

Demo：

https://fjksp.cn

V2 后将改造成作品集形式。

每个项目：

- Project Name
- Description
- Tech Stack
- Status
- Screenshot
- GitHub
- Demo

---

# 30. Archive 页面规划

从当前普通列表升级成：

# 年份时间轴

例如：

```text
2026

● 11-09 我的第一篇博客文章
● 11-08 从零开始搭建我的个人博客

2025

● ...
```

---

# 31. About 页面规划

未来改造成：

# Developer Profile + Anime Profile Card

内容：

- Avatar / Illustration
- FJK
- Developer / Student
- 技术栈
- 兴趣方向
- Blog 介绍
- GitHub
- Personal Slogan

---

# 32. 404 页面规划

主题方向：

> 好像迷路了。

内容：

- Original Illustration
- 404
- 简单说明
- 返回首页
- 返回文章

原则：

简单、有趣、不做复杂逻辑。

---

# 33. 搜索规划

采用：

# Pagefind

搜索范围：

- Article Title
- Description
- Content
- Tags
- Category

搜索 UI 后续单独设计。

---

# 34. 代码块规划

采用：

# Expressive Code

目标：

- 更好看的代码块
- 文件名
- Copy
- Line Highlight
- diff
- 多主题

主要用于：

技术文章。

---

# 35. 评论规划

采用：

# giscus

条件：

GitHub 仓库已公开。

未来需要：

- 开启 GitHub Discussions
- 安装 giscus GitHub App
- 获取 repo / category 配置

这一部分放在后期实施。

---

# 36. 当前主题系统

当前主题系统已经能够：

```text
读取 localStorage
↓
没有保存值
↓
读取 prefers-color-scheme
↓
设置 html.dark
```

当前 ThemeToggle 已经可用。

V2 原则：

> 保留现有主题逻辑，只升级视觉。

不会为了参考 Firefly / Shirone 而推翻已经稳定的主题机制。

---

# 37. 当前 SEO 状态

当前 Layout 已经支持：

- title
- description
- author
- robots
- canonical
- RSS alternate
- OpenGraph
- og:image
- og:image:alt
- article published time
- Twitter Card

生产站点：

```text
https://fjksp.cn
```

SEO 基础已经成熟。

V2 视觉改造期间：

# 不大规模重写 SEO。

---

# 38. 当前代码结构审计结果

V2 开工前完整审计发现：

## 优点

- 项目规模适中
- Astro 页面结构清晰
- Content Collections 合理
- SEO 基础完整
- Theme 逻辑稳定
- RSS / Sitemap 已完成
- 无大型前端框架依赖
- 适合渐进式重构

## 当前主要问题

- 页面 CSS 重复较多
- Header 手机端只是横向滚动
- Design Tokens 仍然简单
- UI 组件抽象程度较低
- 各页面卡片风格存在重复实现
- 部分页面视觉还属于项目早期版本

这些问题正好适合 V2 分阶段解决。

---

# 39. Phase 0 — V2 规划

状态：

```text
[x] 已完成
```

完成内容：

- V2 风格方向确定
- Anime Soft Tech 定义
- 参考项目确定
- 技术路线确定
- 测试流程确定
- Git 工作流确定
- 蓝图建立
- GitHub 仓库建立

初始蓝图提交：

```text
e5e48dd
docs: add blog v2 redesign blueprint
```

---

# 40. Phase 0.5 — V2 开工前整理

状态：

```text
[x] 已完成
```

完成内容：

- 修复 hello-world Markdown 代码块
- 更新 README
- README 从 Astro Starter 改为真实项目说明
- 更新 About 过时内容
- About 增加 GitHub
- Projects 增加真实 GitHub
- Projects 增加真实 Demo
- 更新 building-my-blog 开发状态
- 完善 .gitignore
- `.env.*` 默认忽略
- 保留 `.env.example`
- 完整 Astro build 测试
- Git 提交
- GitHub push

对应提交：

```text
763f382
chore: prepare blog for v2 redesign
```

测试结果：

```text
npm run build
```

通过。

生成：

```text
13 page(s)
```

Sitemap：

正常。

RSS：

正常。

---

# 41. Phase 1 — 视觉基础层

状态：

```text
[ ] 未开始
```

目标：

建立 Anime Soft Tech Design System。

第一阶段主要处理：

- 全局颜色
- Background
- Surface
- Text
- Border
- Radius
- Shadow
- Theme
- Typography
- Selection
- Scrollbar
- Basic Transition

主要文件：

```text
src/styles/global.css
```

必要情况下：

```text
src/layouts/Layout.astro
```

原则：

Phase 1 暂时不重构页面结构。

---

# 42. Phase 1 验收标准

必须满足：

- Light 正常
- Dark 正常
- 系统主题正常
- localStorage 正常
- 页面刷新主题不闪烁
- 首页不崩
- Blog 不崩
- Article 不崩
- About 不崩
- Projects 不崩
- Archive 不崩
- 404 不崩
- npm run build 成功

---

# 43. Phase 2 — 公共组件重构

状态：

```text
[ ] 未开始
```

主要组件：

- Header
- Footer
- ThemeToggle
- Button
- Badge
- Card
- Container
- Section Header

目标：

统一全站视觉语言。

---

# 44. Phase 3 — 首页重构

状态：

```text
[ ] 未开始
```

主要重构：

- Hero
- Greeting
- CTA
- Illustration
- Latest Articles
- Featured Article
- Categories
- Projects Preview
- Footer Section

这是第一次完整视觉验收节点。

---

# 45. Phase 4 — 内容页面

状态：

```text
[ ] 未开始
```

重构：

- Blog
- Article
- Category
- Tag
- Archive

重点：

# 阅读体验

---

# 46. Phase 5 — About / Projects / 404

状态：

```text
[ ] 未开始
```

完成辅助页面统一。

---

# 47. Phase 6 — 搜索

状态：

```text
[ ] 未开始
```

接入：

# Pagefind

验收：

- 搜索页面可打开
- 中文可以搜索
- 文章正文可以搜索
- 搜索结果链接正确
- 构建后搜索正常

---

# 48. Phase 7 — 代码阅读体验

状态：

```text
[ ] 未开始
```

接入：

# Expressive Code

验收：

- JS
- TS
- HTML
- CSS
- Bash
- JSON

代码块显示正常。

---

# 49. Phase 8 — 评论

状态：

```text
[ ] 未开始
```

接入：

# giscus

需要：

- GitHub Discussions
- Discussion Category
- Repo ID
- Category ID

---

# 50. Phase 9 — 动效与细节

状态：

```text
[ ] 未开始
```

包括：

- Hover
- Entrance Animation
- Navigation Transition
- Mobile Menu
- Cover Zoom
- Small Decorative Animation

原则：

控制性能影响。

---

# 51. Phase 10 — 完整测试

状态：

```text
[ ] 未开始
```

通过后才能部署 V2。

---

# 52. 每阶段标准开发流程

所有阶段必须遵守：

```text
规划
↓
确认修改文件
↓
确认 Git 工作区干净
↓
完整文件覆盖
↓
npm run dev
↓
浏览器测试
↓
npm run build
↓
git diff
↓
git diff --check
↓
git add
↓
git commit
↓
git push
↓
进入下一阶段
```

---

# 53. 源代码修改规则

后续所有代码修改遵守：

## 规则 1

如果修改已有源代码文件：

# 提供完整文件内容。

禁止只给局部 patch。

---

## 规则 2

每次只修改必要文件。

避免：

```text
一次改十几个文件
```

---

## 规则 3

每完成一个阶段：

必须：

```text
npm run build
```

---

## 规则 4

构建通过后：

```text
git diff --check
```

---

## 规则 5

Git 工作区确认正常后才提交。

---

# 54. Git 提交策略

推荐按阶段提交。

示例：

```text
docs: update blog v2 blueprint

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

# 55. 页面测试清单

必须测试：

```text
/
```

```text
/blog
```

```text
/blog/[id]
```

```text
/projects
```

```text
/archive
```

```text
/about
```

```text
/blog/category/[category]
```

```text
/blog/tag/[tag]
```

```text
/404
```

---

# 56. 主题测试

必须检查：

- Light
- Dark
- System
- localStorage
- Refresh
- Navigation
- New Tab

---

# 57. Responsive 测试

至少测试：

```text
375px
430px
768px
1024px
1440px
```

---

# 58. 内容测试

必须检查：

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
- Links

---

# 59. SEO 测试

检查：

- title
- description
- canonical
- OpenGraph
- Twitter Card
- robots
- RSS
- sitemap
- article metadata

---

# 60. 构建测试

必须：

```bash
npm run build
```

无：

```text
Error
```

无严重 Warning。

---

# 61. 性能原则

尽量保持：

- Static Generation
- 少量 JS
- 图片合理加载
- CSS 优先
- 不引入大型 UI Framework
- 避免过度 hydration
- 动画优先 CSS

目标：

> Anime 风格不能明显降低 Astro 的性能优势。

---

# 62. 图片原则

文章封面：

当前继续使用：

```text
16:9
```

显示方式：

```text
object-fit: cover
```

未来 Hero 插画：

优先使用：

- WebP
- AVIF
- PNG

根据透明背景需求选择格式。

---

# 63. Anime 素材原则

禁止直接把其他 Anime 博客中的商业角色素材搬过来。

例如：

- 商业动画角色
- 游戏角色
- 他人原创角色
- 未授权插画

优先：

- 原创
- AI 原创
- 自己制作
- 明确授权素材

---

# 64. 当前暂不实施事项

暂缓：

- 更换框架
- React 全站化
- Vue 全站化
- Svelte 全站化
- 引入数据库
- CMS
- 用户系统
- 服务端 API
- Docker 博客部署
- 后台管理系统

原因：

当前个人博客没有必要增加这些复杂度。

---

# 65. 部署原则

生产环境继续：

```text
Astro Static Build
        ↓
      Nginx
        ↓
https://fjksp.cn
```

部署前：

```bash
npm run build
```

成功。

再上传：

```text
dist/
```

---

# 66. 生产部署测试

部署后检查：

- 首页
- HTTPS
- www 重定向
- HTTP → HTTPS
- Blog
- Article
- About
- Projects
- Archive
- 404
- RSS
- Sitemap
- robots.txt
- Mobile
- Dark Mode

---

# 67. 当前项目风险

## 风险 1

CentOS 7 已 EOL。

长期应该迁移到受支持系统。

---

## 风险 2

SSL 自动续期当前没有配置。

需要注意证书有效期。

---

## 风险 3

页面 CSS 当前重复较多。

V2 应逐步统一。

---

## 风险 4

未来引入 Pagefind / giscus / Expressive Code 后，要避免依赖快速膨胀。

---

# 68. V2 完成标准

视觉：

- 有明确个人风格
- Anime 氛围统一
- Light / Dark 完整
- 手机和桌面一致

内容：

- 阅读舒适
- Markdown 完整
- 图片正常
- 代码清晰

功能：

- Search
- TOC
- Comments
- RSS
- Sitemap
- Categories
- Tags
- Archive

技术：

- Astro build 成功
- 无明显 Console Error
- SEO 正常
- HTTPS 正常
- Nginx 正常

Git：

- main 干净
- GitHub 与本地同步
- 每阶段有清晰 commit

---

# 69. 当前进度

当前整体状态：

```text
项目基础功能       ██████████ 100%

服务器部署         ██████████ 100%

HTTPS              ██████████ 100%

服务器基础安全     ██████████ 100%

GitHub 仓库        ██████████ 100%

V2 规划            ██████████ 100%

V2 开工前整理      ██████████ 100%

视觉基础           ░░░░░░░░░░ 0%

公共组件           ░░░░░░░░░░ 0%

首页重构           ░░░░░░░░░░ 0%

内容页面           ░░░░░░░░░░ 0%

辅助页面           ░░░░░░░░░░ 0%

搜索               ░░░░░░░░░░ 0%

代码体验           ░░░░░░░░░░ 0%

评论               ░░░░░░░░░░ 0%

动效优化           ░░░░░░░░░░ 0%

完整测试           ░░░░░░░░░░ 0%

V2 生产部署        ░░░░░░░░░░ 0%
```

---

# 70. 已完成关键 Git 提交

## V2 Blueprint

```text
e5e48dd
docs: add blog v2 redesign blueprint
```

## V2 开工前整理

```text
763f382
chore: prepare blog for v2 redesign
```

---

# 71. 当前代码基线

当前 V2 正式开发基线：

```text
branch:
main

commit:
763f382
```

要求：

Phase 1 从这个干净基线开始。

---

# 72. 下一阶段

# Phase 1 — Anime Soft Tech 视觉基础层

下一步正式修改：

```text
src/styles/global.css
```

必要情况下：

```text
src/layouts/Layout.astro
```

第一阶段目标：

建立：

- Background System
- Surface System
- Primary Color
- Secondary Color
- Text System
- Border System
- Radius System
- Shadow System
- Glass System
- Typography
- Selection
- Scrollbar
- Light / Dark 对应关系

---

# 73. Phase 1 不做什么

Phase 1 暂时不：

- 改首页 Hero
- 改 Article Card
- 改 Header 结构
- 改 Projects 结构
- 改 About 结构
- 增加 Pagefind
- 增加 giscus
- 增加 Expressive Code

原因：

先建立稳定设计基础。

---

# 74. Phase 1 完成后的预期效果

页面结构不会明显改变。

但视觉会开始从当前：

```text
Minimal Blog
```

逐渐进入：

```text
Anime Soft Tech
```

用户应该能明显感觉到：

- 背景更柔和
- 卡片层次更清晰
- Dark Mode 更有氛围
- 主色更加统一
- Border 更自然
- 圆角更现代
- 页面整体更加完整

同时：

功能完全保持不变。

---

# 75. Phase 1 Git 提交建议

完成后：

```text
style: establish anime soft tech design system
```

---

# 76. 最终项目原则

始终坚持：

> 好看，但不过度设计。

> 二次元，但不影响阅读。

> 功能丰富，但不牺牲性能。

> 借鉴优秀项目，但不复制别人的博客。

> 优先解决真实问题，而不是为了复杂而复杂。

> 每一个新增依赖都必须有明确价值。

> 每一次大改都必须可以通过 Git 回退。

> 最终形成属于 FJK 的博客设计语言。
# FJK Blog

我的个人博客项目，用于记录技术学习、项目实践、工具使用与个人内容。

在线访问：

https://fjksp.cn

项目仓库：

https://github.com/jiashuaifu13-blip/fjk-blog

## 项目简介

FJK Blog 是一个基于 Astro 构建的静态个人博客。

项目从零开始开发，并持续进行功能完善与视觉升级。目前已经具备完整的文章系统、分类与标签、归档、暗色模式、SEO、RSS、Sitemap 和静态部署能力。

下一阶段将按照项目蓝图进行 **FJK Blog V2 — Anime Soft Tech** 风格改造。

## 技术栈

- Astro 7
- TypeScript
- Tailwind CSS 4
- Markdown / MDX
- Astro Content Collections
- Git
- Nginx

## 当前功能

- 首页
- 文章列表
- 动态文章页面
- 分类系统
- 标签系统
- 归档页面
- 项目页面
- 关于页面
- 自定义 404 页面
- Markdown / MDX
- Content Collections
- 草稿机制
- 文章封面
- 上一篇 / 下一篇
- 响应式布局
- 亮色 / 暗色主题
- 系统主题检测
- 主题偏好持久化
- SEO metadata
- OpenGraph
- Twitter Card
- RSS
- Sitemap
- robots.txt
- HTTPS
- Nginx 静态部署

## V2 改造计划

项目正在进行第二阶段视觉与体验升级。

目标风格：

**Anime Soft Tech**

主要方向：

- 日系二次元视觉语言
- 更完整的 Design Tokens
- 全新的 Header 与导航
- 首页 Hero 重构
- 文章卡片重构
- 更好的文章阅读体验
- 移动端导航
- Pagefind 全文搜索
- Expressive Code
- giscus 评论
- 更完整的动效与视觉细节

完整改造计划见：

```text
docs/BLOG_V2_BLUEPRINT.md
```

## 项目结构

```text
.
├── docs/
│   └── BLOG_V2_BLUEPRINT.md
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/
│   ├── config/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认开发地址：

```text
http://localhost:4321
```

## 构建

生成生产环境静态文件：

```bash
npm run build
```

构建结果位于：

```text
dist/
```

本地预览生产构建：

```bash
npm run preview
```

## 部署

当前生产环境采用：

```text
Astro Static Build
        ↓
      Nginx
        ↓
https://fjksp.cn
```

服务器只负责提供构建后的静态文件，不在生产环境运行 Node.js。

## 开发原则

项目后续改造遵循：

```text
规划
↓
修改
↓
本地开发测试
↓
生产构建
↓
Git 提交
↓
进入下一阶段
```

视觉升级不会以牺牲 Astro 的静态性能优势为代价。

## 状态

当前阶段：

**FJK Blog V2 开工前整理**

详细开发进度见：

```text
docs/BLOG_V2_BLUEPRINT.md
```

## License

目前项目尚未指定开源许可证。

在正式选择许可证之前，请勿默认将仓库中的代码或素材视为可自由再发布内容。
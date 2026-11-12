---
title: "从零开始搭建我的个人博客"
description: "记录使用 Astro 从零构建个人博客的过程。"
date: 2026-11-08
category: "项目"
tags:
  - Astro
  - TypeScript
  - Blog
cover: "/images/anime/covers/sakura-landscape.webp"
coverAlt: "樱花与城市风景插画"
draft: false
---

# 从零开始搭建我的个人博客

这篇文章记录个人博客从零开始开发的过程。

## 技术栈

目前使用：

- Astro
- TypeScript
- Tailwind CSS
- Markdown / MDX
- Git
- Nginx

## 开发目标

这个博客主要用于记录：

- 技术学习
- 项目开发
- 工具使用
- 个人内容

最初规划继续增加：

- 标签系统
- 归档
- 暗色模式
- SEO
- RSS
- Docker 部署

## 当前进展

随着项目持续开发，目前已经完成：

- 标签系统
- 分类系统
- 文章归档
- 暗色模式
- 主题偏好持久化
- SEO
- OpenGraph
- Twitter Card
- RSS
- Sitemap
- robots.txt
- HTTPS
- Nginx 静态部署
- GitHub 仓库

Docker 部署目前暂缓。

生产环境继续采用：

```text
Astro Static Build
        ↓
      Nginx
        ↓
https://fjksp.cn
```

这样可以保持服务器环境简单，并充分利用 Astro 静态站点的性能优势。

## 下一阶段

博客现在已经进入第二阶段改造。

下一阶段的目标是：

**FJK Blog V2 — Anime Soft Tech**

主要包括：

- 全新的视觉设计系统
- 日系二次元风格
- 首页 Hero 重构
- Header 与移动端导航重构
- 更好的文章卡片
- 更好的文章阅读体验
- Pagefind 搜索
- Expressive Code
- giscus 评论系统
- 更完整的响应式和动画体验

项目会继续按照：

```text
规划
↓
落地
↓
测试
↓
Git 提交
```

的方式逐步推进。
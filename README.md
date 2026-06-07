# AI Tech Briefing

面向开发者的 AI 技术情报助手。

用户可以订阅自己关注的技术主题和 RSS 信息源，系统定时抓取内容，通过 AI 生成中文摘要，并在 Briefing 页面按时间线展示每日技术动态。

## 功能范围

MVP 已包含以下基础能力：

- 用户登录、注册、GitHub OAuth、用户资料
- RSS Feed 添加、删除、分类管理
- 每小时定时抓取 Feed 内容
- 文章去重、入库、来源记录
- OpenAI 自动生成中文标题、三句话摘要、核心观点、关键词
- Briefing 信息流、文章详情、收藏、搜索 API
- Next.js Route Handlers REST API
- Prisma PostgreSQL 数据模型
- ESLint、Prettier、Husky、Commitlint、Vitest、GitHub Actions
- Docker 和 Vercel Cron 配置

V2 只保留设计方案，暂不开发：

- AI 问答
- 邮件日报
- AI 趋势分析
- pgvector 向量搜索

## 技术栈

- 前端：Next.js App Router、TypeScript、TailwindCSS、shadcn/ui 风格组件、TanStack Query、Zustand
- 后端：Next.js Route Handlers
- 数据库：PostgreSQL
- ORM：Prisma
- 认证：NextAuth
- 定时任务：Vercel Cron
- AI：OpenAI SDK
- 部署：Vercel

## 本地启动

安装依赖：

```bash
npm install
```

复制环境变量示例：

```bash
cp .env.example .env
```

启动 PostgreSQL：

```bash
docker compose up -d
```

生成 Prisma Client：

```bash
npm run db:generate
```

执行数据库迁移：

```bash
npm run db:migrate
```

启动开发服务器：

```bash
npm run dev
```

访问：

```txt
http://localhost:3000
```

## 环境变量

参考 [.env.example](./.env.example)。

关键变量：

- `DATABASE_URL`：PostgreSQL 连接串
- `NEXTAUTH_URL`：NextAuth 应用地址
- `NEXTAUTH_SECRET`：NextAuth 密钥
- `GITHUB_CLIENT_ID`：GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET`：GitHub OAuth Client Secret
- `OPENAI_API_KEY`：OpenAI API Key
- `OPENAI_MODEL`：摘要模型，默认 `gpt-4o-mini`
- `CRON_SECRET`：保护 Cron 接口的密钥

## 常用命令

```bash
npm run dev          # 启动开发服务
npm run build        # 生产构建
npm run start        # 启动生产服务
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
npm run typecheck    # TypeScript 类型检查
npm run test         # 单元测试
npm run db:generate  # 生成 Prisma Client
npm run db:migrate   # 执行数据库迁移
npm run db:studio    # 打开 Prisma Studio
```

## 项目文档

设计和架构文档已放在 `docs/` 目录，建议随项目一起版本管理：

- [产品需求文档 PRD](./docs/prd.md)
- [系统架构设计](./docs/architecture.md)
- [数据库设计](./docs/database.md)
- [API 设计](./docs/api.md)
- [项目目录结构](./docs/project-structure.md)

这些文档中的架构图和关系图使用 Mermaid 编写，可在 GitHub Markdown 中直接渲染。

## 部署说明

项目已包含 [vercel.json](./vercel.json)，Cron 配置如下：

```json
{
  "path": "/api/cron/fetch-feeds",
  "schedule": "0 * * * *"
}
```

部署到 Vercel 后，需要在 Vercel Project Settings 中配置 `.env.example` 中列出的环境变量。

## 安全说明

- 不要提交真实 `.env` 文件
- 不要在日志或输出中打印 Token、API Key、OAuth Secret
- `/api/cron/fetch-feeds` 必须通过 `CRON_SECRET` 调用
- 用户只能访问自己的 Feed、分类和收藏数据

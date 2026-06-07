# AGENTS.md

本文件是 AI Tech Briefing 项目的开发协作指令。任何 AI 编码助手在修改本项目时，都应优先阅读并遵守本文件，避免偏离产品目标、架构边界和工程规范。

## 基础行为

- 默认使用中文沟通，除非用户明确要求其他语言。
- 回答简洁直接，优先给结论、变更点和验证结果。
- 任务不清晰时先确认，不主动扩展用户没有要求的需求。
- 不在输出中打印密钥、Token、OAuth Secret、数据库连接串等敏感信息。
- 修改文件前先理解现有代码结构，不做无关重构。

## 产品目标

项目名称：AI Tech Briefing。

目标：打造面向开发者的 AI 技术情报助手。用户订阅技术信息源，系统定时抓取文章，通过 AI 生成中文技术摘要，并展示每日 Briefing。

核心用户：

- 开发者
- 独立开发者
- 技术团队
- 技术管理者

## MVP 范围

当前只开发 MVP：

- 用户系统：登录、注册、GitHub OAuth、用户资料
- RSS 订阅：添加、删除、分类
- 内容抓取：每小时抓取 RSS Feed，保存标题、正文、发布时间、来源、原文链接
- 去重：避免重复抓取同一 Feed 下的文章
- AI 摘要：中文标题、三句话摘要、核心观点、关键词
- Briefing 页面：按发布时间倒序展示文章卡片
- 收藏功能：收藏和取消收藏文章
- 搜索功能：标题、摘要、来源搜索

## 暂不开发的 V2

以下功能不要在未明确要求时实现，只保留设计预留：

- AI 问答
- 邮件日报
- AI 趋势分析
- pgvector 向量搜索
- 语义检索
- 多 Agent 工作流

如果任务涉及 V2 功能，先确认是否要进入 V2 开发。

## 技术栈

- 前端：Next.js App Router、TypeScript、TailwindCSS、shadcn/ui 风格组件、TanStack Query、Zustand
- 后端：Next.js Route Handlers
- 数据库：PostgreSQL
- ORM：Prisma 7
- 认证：NextAuth
- 定时任务：Vercel Cron
- AI：OpenAI SDK
- 部署：腾讯云轻量服务器 + Docker Compose + Caddy；数据库使用 Supabase PostgreSQL
- 测试：Vitest

## 关键文档

修改功能前优先查看：

- `README.md`：项目说明和启动方式
- `docs/prd.md`：产品需求文档
- `docs/architecture.md`：系统架构图和模块边界
- `docs/database.md`：数据库关系和约束
- `docs/api.md`：REST API 设计
- `docs/deployment.md`：腾讯云 Docker + Supabase 部署流程
- `docs/project-structure.md`：目录结构和分层原则
- `prisma/schema.prisma`：真实数据库模型

如果代码实现和文档不一致，修改代码时同步更新相关文档。

## 架构原则

- 保持单体 Next.js 架构，不拆微服务。
- Route Handler 只负责请求解析、鉴权、调用 service、返回响应。
- 业务逻辑放在 `src/services/`。
- 基础设施封装放在 `src/lib/`。
- UI 组件放在 `src/components/`，按业务域拆分。
- TanStack Query hook 放在 `src/hooks/`。
- Zustand 只保存轻量 UI 状态，不保存服务端权威数据。
- 数据访问统一通过 Prisma，不在组件中直接访问数据库。
- Cron 入口必须校验 `CRON_SECRET`；自托管部署通过 `deploy/docker-compose.prod.yml` 中的 `cron` 容器每小时触发。
- AI 摘要失败不能影响文章入库和已有 Briefing 展示。

## Next.js 约束

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

- 使用 App Router，不使用 Pages Router。
- Server Components 为默认选择，需要交互时才加 `"use client"`。
- 避免在模块顶层初始化数据库、OpenAI、邮件等外部客户端。
- Prisma Client 使用 `getPrisma()` 懒初始化。
- 不重新引入 `next/font/google`，避免离线或 CI 构建时拉取 Google Fonts 失败。
- 受保护页面应通过服务端 session 判断并重定向。

## Prisma 7 约束

- `schema.prisma` 不写 `datasource.url`。
- 数据库连接配置在 `prisma.config.ts`。
- Prisma Client 使用 `@prisma/adapter-pg`。
- 修改 Prisma Schema 后运行：

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_tech_briefing npm run db:generate
```

- 需要迁移时运行：

```bash
npm run db:migrate
```

## 数据权限

- 用户只能管理自己的 Feed、FeedCategory、Bookmark。
- 用户只能查看自己 Feed 抓取到的 Article。
- Bookmark 必须绑定用户和文章。
- Cron 可扫描所有启用 Feed，但必须受 `CRON_SECRET` 保护。
- 不要添加绕过权限校验的 API。

## UI 规范

- 保持当前视觉方向：深色应用外壳、浅色内容卡片、青绿色主色、温暖中性色背景。
- 优先复用 `src/components/ui/` 和现有业务组件。
- 不要引入默认模板感很强的页面。
- 不要随意新增大段营销内容，MVP 重点是产品工作台。
- 表单、按钮、卡片、徽章等样式应保持一致。
- 移动端至少保证不溢出、可阅读、可操作。

## 工程规范

- 避免过度设计，只做任务明确要求或明显必要的改动。
- 不为只使用一次的逻辑创建抽象层。
- 不为未改动代码添加注释、类型标注或文档字符串。
- 只有逻辑不自明时才添加简短注释。
- 确认无用代码后直接删除，不留注释说明。
- 不提交真实 `.env`。
- `.env.example` 应保留并随配置变化更新。
- `.env.production.example` 应保留并随生产部署配置变化更新。
- 不提交 `node_modules`、`.next`、`*.tsbuildinfo`。

## 常用命令

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_tech_briefing npm run db:generate
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_tech_briefing npm run db:deploy
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_tech_briefing NEXTAUTH_SECRET=test-nextauth-secret CRON_SECRET=test-cron-secret npm run build
```

说明：

- `next build` 在受限沙箱中可能因 Turbopack 内部端口绑定失败，需要提升权限重跑。
- 生产数据库迁移使用 `npm run db:deploy`，不要在生产环境使用 `npm run db:migrate`。
- Supabase 连接优先使用 Session Pooler，除非确认服务器支持 IPv6 或已购买 IPv4 add-on。
- `npm audit --audit-level=high` 需要联网；不要擅自执行 `npm audit fix --force`，因为可能引入破坏性版本变更。

## 提交规范

使用 Conventional Commits：

- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `refactor:` 重构
- `test:` 测试
- `chore:` 工程杂项

提交前至少运行与改动相关的检查。文档改动至少运行：

```bash
npm run format:check
```

代码改动通常运行：

```bash
npm run lint
npm run typecheck
npm run test
```

## GitHub

公开仓库：

```txt
https://github.com/Shaoyi23/ai-tech-briefing
```

默认分支：

```txt
main
```

推送前确认工作区只包含本次任务相关改动。

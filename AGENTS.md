# AGENTS.md

本文件是 AI 技术简报项目的开发协作指令。任何 AI 编码助手在修改本项目时，都应优先阅读并遵守本文件。

## 基础行为

- 默认使用中文沟通，除非用户明确要求其他语言。
- 回答简洁直接，优先给结论、变更点和验证结果。
- 不在输出中打印密钥、Token、数据库连接串等敏感信息。
- 避免过度设计，只做当前阶段真正需要的改动。

## 当前目标

项目当前阶段是轻量全栈 MVP。

核心目标：

- 使用 Vite React 展示 AI 技术简报界面
- 使用 Express 提供轻量后端 API
- 默认使用 mock 数据
- 可选接入 Supabase 免费数据库
- 不接入登录
- 不调用 OpenAI
- 能部署到腾讯云服务器 Docker 内访问
- 所有页面可见文字使用中文

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react
- Express
- Supabase JS
- Vitest
- Docker + Node.js

## 当前不做

除非用户明确要求，不要主动加入：

- Next.js
- Prisma
- NextAuth
- OAuth 登录
- RSS 后端抓取
- OpenAI 接口调用
- 定时任务

## 架构原则

- 当前是 Vite React + Express 单仓应用。
- 入口是 `src/main.tsx`。
- 主界面在 `src/App.tsx`。
- 后端入口是 `server/index.ts`。
- 模拟数据放在 `src/data/mock.ts`。
- UI 基础组件放在 `src/components/ui/`。
- 前端优先请求 `/api/articles`，失败时回退到 mock 数据。
- Supabase 密钥只允许放在服务端环境变量，禁止写入前端代码。

## UI 规范

- 页面文字使用中文。
- 保持产品工作台风格，不做营销页。
- 优先清晰展示信息流、分类、搜索、收藏和订阅源。
- 移动端至少保证不溢出、可阅读、可操作。
- 卡片圆角保持克制，不使用过大的装饰圆角。

## 常用命令

```bash
npm run dev
npm run dev:api
npm run build
npm run lint
npm run typecheck
npm run test
npm run format:check
```

## 部署

服务器部署：

```bash
docker build -t ai-tech-briefing .
docker rm -f ai-tech-briefing || true
docker run -d --name ai-tech-briefing -p 80:80 --restart unless-stopped ai-tech-briefing
```

## 提交规范

使用 Conventional Commits：

- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `refactor:` 重构
- `test:` 测试
- `chore:` 工程杂项

# AI 技术简报

面向开发者的 AI 技术情报助手原型。

当前版本是轻量全栈 MVP：使用 Vite React 展示中文技术简报界面，使用 Express 提供 `/api/*` 接口。未配置 Supabase 时自动使用本地 mock 数据；配置 Supabase 后可以逐步切换到真实数据库。

## 当前功能

- 技术简报信息流
- 中文文章标题、摘要、核心观点、关键词展示
- 分类筛选
- 标题、摘要、来源搜索
- 收藏列表展示
- 订阅源管理展示
- 后端健康检查接口
- 文章列表 API
- 移动端和桌面端自适应布局

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

## 本地启动

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

另开一个终端启动后端接口：

```bash
npm run dev:api
```

访问：

```txt
http://localhost:5173
```

## 常用命令

```bash
npm run dev          # 启动 Vite 开发服务
npm run dev:api      # 启动 Express 后端开发服务
npm run build        # 构建前端 dist/ 和后端 server-dist/
npm run start        # 启动编译后的 Express 服务
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
npm run format:check # 检查格式
npm run typecheck    # TypeScript 类型检查
npm run test         # 单元测试
```

## 环境变量

不配置 Supabase 时，后端会自动使用 mock 数据。

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
PORT=3001
```

`SUPABASE_SERVICE_ROLE_KEY` 只能放在服务端环境变量中，不要写入前端代码，也不要提交真实值。

## Docker 部署

当前 Dockerfile 会在容器内完成前端和后端构建，运行时由 Express 同时提供静态页面和 API。

```bash
docker build -t ai-tech-briefing .
docker rm -f ai-tech-briefing || true
docker run -d --name ai-tech-briefing -p 80:80 --restart unless-stopped ai-tech-briefing
```

访问：

```txt
http://服务器公网IP
```

## 自动部署

项目包含 GitHub Actions 自动部署流程：

```txt
Git Push -> GitHub Actions -> SSH 登录服务器 -> 拉取代码 -> 构建 dist -> 构建镜像 -> 重启容器
```

需要在 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 配置：

- `SERVER_HOST`：服务器公网 IP
- `SERVER_USER`：SSH 用户名
- `SERVER_SSH_KEY`：SSH 私钥
- `SERVER_PROJECT_PATH`：服务器上的项目目录，例如 `/opt/ai-tech-briefing`
- `SERVER_PORT`：SSH 端口，可选，默认 `22`
- `SERVER_APP_PORT`：网站访问端口，可选，默认 `80`

## 文档

- [产品需求文档](./docs/prd.md)
- [当前架构说明](./docs/architecture.md)
- [数据库设计](./docs/database.md)
- [部署流程](./docs/deployment.md)
- [项目目录结构](./docs/project-structure.md)

`docs/api.md` 和 `docs/database.md` 会随着后端与 Supabase 接入逐步更新。

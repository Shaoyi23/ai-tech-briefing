# AI 技术简报

面向开发者的 AI 技术情报助手原型。

当前版本已经收敛为轻量前端 MVP：使用 Vite React 展示中文技术简报界面，数据全部来自本地 mock，不连接数据库，不需要登录，也不调用 OpenAI。目标是先部署到服务器让页面稳定展示，再逐步接入真实功能。

## 当前功能

- 技术简报信息流
- 中文文章标题、摘要、核心观点、关键词展示
- 分类筛选
- 标题、摘要、来源搜索
- 收藏列表展示
- 订阅源管理展示
- 移动端和桌面端自适应布局

## 技术栈

- Vite
- React
- TypeScript
- Tailwind CSS
- lucide-react
- Vitest
- Docker + Nginx

## 本地启动

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

访问：

```txt
http://localhost:5173
```

## 常用命令

```bash
npm run dev          # 启动 Vite 开发服务
npm run build        # 生产构建，输出 dist/
npm run start        # 本地预览服务
npm run lint         # ESLint 检查
npm run format       # Prettier 格式化
npm run format:check # 检查格式
npm run typecheck    # TypeScript 类型检查
npm run test         # 单元测试
```

## 环境变量

当前静态前端版本不需要环境变量。

如果使用带域名的 Caddy 部署，只需要在 `.env.production` 中配置：

```env
APP_DOMAIN=你的域名
```

无域名、直接使用服务器 IP 部署时，不需要 `.env.production`。

## Docker 部署

无域名部署，直接使用服务器公网 IP：

```bash
docker compose -f deploy/docker-compose.server.yml up -d --build app
```

访问：

```txt
http://服务器公网IP
```

带域名和 HTTPS 部署：

```bash
cp .env.production.example .env.production
docker compose -f deploy/docker-compose.prod.yml up -d --build app caddy
```

## 文档

- [产品需求文档](./docs/prd.md)
- [当前架构说明](./docs/architecture.md)
- [部署流程](./docs/deployment.md)
- [项目目录结构](./docs/project-structure.md)

`docs/api.md` 和 `docs/database.md` 保留为后续接入真实后端时的设计参考，当前版本不启用 API 和数据库。

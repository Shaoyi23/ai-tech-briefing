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

当前 Dockerfile 使用本地构建好的 `dist/` 目录生成 Nginx 静态镜像。

```bash
npm run build
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
- [部署流程](./docs/deployment.md)
- [项目目录结构](./docs/project-structure.md)

`docs/api.md` 和 `docs/database.md` 保留为后续接入真实后端时的设计参考，当前版本不启用 API 和数据库。

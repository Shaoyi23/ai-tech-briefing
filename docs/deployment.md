# 腾讯云 Docker 部署流程

当前项目是 Vite React 静态前端，生产构建产物为 `dist/`，Docker 运行时使用 Nginx 托管静态文件。

当前版本不需要数据库、不需要 OpenAI Key、不需要 Cron，也不需要登录配置。

## 1. 无域名部署

适合现在先用服务器公网 IP 跑通展示。

服务器要求：

- 已安装 Docker
- 已安装 Docker Compose
- 安全组开放 `80/tcp`

在服务器上拉取代码：

```bash
git clone https://github.com/Shaoyi23/ai-tech-briefing.git
cd ai-tech-briefing
```

启动：

```bash
docker compose -f deploy/docker-compose.server.yml up -d --build app
```

查看状态：

```bash
docker compose -f deploy/docker-compose.server.yml ps
```

查看日志：

```bash
docker compose -f deploy/docker-compose.server.yml logs -f app
```

访问：

```txt
http://服务器公网IP
```

## 2. 带域名部署

后续如果要使用域名和 HTTPS，可以使用 Caddy。

`.env.production` 只需要：

```env
APP_DOMAIN=你的域名
```

启动：

```bash
docker compose -f deploy/docker-compose.prod.yml up -d --build app caddy
```

查看状态：

```bash
docker compose -f deploy/docker-compose.prod.yml ps
```

## 3. 更新部署

无域名：

```bash
git pull
docker compose -f deploy/docker-compose.server.yml up -d --build app
```

带域名：

```bash
git pull
docker compose -f deploy/docker-compose.prod.yml up -d --build app caddy
```

## 4. 停止服务

无域名：

```bash
docker compose -f deploy/docker-compose.server.yml down
```

带域名：

```bash
docker compose -f deploy/docker-compose.prod.yml down
```

## 5. 当前不需要的步骤

这些能力会在后续版本再接入：

- Supabase 数据库
- RSS 抓取任务
- OpenAI 摘要
- 登录和用户系统
- 定时任务

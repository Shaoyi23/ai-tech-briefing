# 腾讯云 Docker 部署流程

当前项目是 Vite React + Express 轻量全栈应用。Dockerfile 会在容器内构建前端 `dist/` 和后端 `server-dist/`，运行时由 Express 同时提供静态页面和 `/api/*` 接口。

当前版本不需要 OpenAI Key、Cron 和登录配置。Supabase 是可选配置，不配置时接口会返回 mock 数据。

## 1. 无域名部署

适合现在先用服务器公网 IP 跑通展示。

服务器要求：

- 已安装 Docker
- 安全组开放 `80/tcp`

在服务器上拉取代码：

```bash
git clone https://github.com/Shaoyi23/ai-tech-briefing.git
cd ai-tech-briefing
```

启动：

```bash
docker build -t ai-tech-briefing .
docker rm -f ai-tech-briefing || true
docker run -d --name ai-tech-briefing -p 80:80 --restart unless-stopped ai-tech-briefing
```

查看状态：

```bash
docker ps --filter name=ai-tech-briefing
```

查看日志：

```bash
docker logs -f ai-tech-briefing
```

访问：

```txt
http://服务器公网IP
```

## 2. Supabase 环境变量

如果要连接 Supabase，在服务器容器启动时传入：

```bash
docker run -d \
  --name ai-tech-briefing \
  -p 80:80 \
  -e SUPABASE_URL="你的 Supabase URL" \
  -e SUPABASE_SERVICE_ROLE_KEY="你的服务端密钥" \
  --restart unless-stopped \
  ai-tech-briefing
```

不要把 `SUPABASE_SERVICE_ROLE_KEY` 写进前端代码或提交到仓库。

## 3. 更新部署

手动更新：

```bash
git pull
docker build -t ai-tech-briefing .
docker rm -f ai-tech-briefing || true
docker run -d --name ai-tech-briefing -p 80:80 --restart unless-stopped ai-tech-briefing
```

GitHub Actions 自动部署会执行同等流程。

## 4. 停止服务

```bash
docker rm -f ai-tech-briefing
```

## 5. 当前不做

这些能力会在后续版本再接入：

- RSS 抓取任务
- OpenAI 摘要
- 登录和用户系统
- 定时任务

## 6. 接口检查

```bash
curl http://服务器公网IP/api/health
curl http://服务器公网IP/api/articles
```

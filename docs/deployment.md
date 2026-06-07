# 腾讯云 Docker + Supabase 部署流程

本项目可以部署到自有腾讯云轻量服务器，数据库使用 Supabase 托管 PostgreSQL。

## 1. 推荐架构

```mermaid
flowchart TB
  User["用户浏览器"] --> Domain["你的域名"]
  Domain --> Caddy["Caddy HTTPS 反向代理"]
  Caddy --> App["Next.js Docker 容器"]

  Cron["Docker Cron 容器"] --> App
  App --> Supabase["Supabase PostgreSQL"]
  App --> GitHub["GitHub OAuth"]
  App --> OpenAI["OpenAI API"]
```

## 2. 为什么这样部署

- 腾讯云服务器只运行 Web 应用、反向代理和 Cron。
- Supabase 只作为 PostgreSQL 托管数据库使用。
- NextAuth 仍由本项目处理，不使用 Supabase Auth。
- Caddy 自动申请和续期 HTTPS 证书。
- Docker Compose 管理 app、cron、migrate、caddy 四个服务。

## 3. Supabase 连接方式

根据 Supabase 官方文档：

- 持久化服务器或长生命周期容器优先使用 Direct connection。
- 如果服务器网络是 IPv4-only，使用 Supavisor Session Pooler。
- Transaction Pooler 更适合 serverless / edge functions，且不支持 prepared statements。

腾讯云轻量服务器通常更稳妥地使用 Supavisor Session Pooler：

```txt
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
```

在 Supabase Dashboard 中获取：

```txt
Project -> Connect -> Session pooler
```

如果你的服务器确认支持 IPv6，也可以使用 Direct connection：

```txt
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

## 4. 服务器准备

服务器需要：

- Docker
- Docker Compose
- 80 / 443 端口开放
- 域名 A 记录指向服务器公网 IP

安全组至少放行：

```txt
80/tcp
443/tcp
```

不需要开放 PostgreSQL 端口，因为数据库在 Supabase。

## 5. 上传代码

在服务器上拉取仓库：

```bash
git clone https://github.com/Shaoyi23/ai-tech-briefing.git
cd ai-tech-briefing
```

如果服务器没有 Git，也可以从 GitHub 下载压缩包后解压。

## 6. 配置生产环境变量

复制示例文件：

```bash
cp .env.production.example .env.production
```

编辑 `.env.production`：

```bash
nano .env.production
```

需要重点配置：

```txt
APP_DOMAIN=你的域名
DATABASE_URL=Supabase Session Pooler 连接串
NEXTAUTH_URL=https://你的域名
NEXTAUTH_SECRET=随机强密钥
GITHUB_CLIENT_ID=GitHub OAuth Client ID
GITHUB_CLIENT_SECRET=GitHub OAuth Client Secret
OPENAI_API_KEY=OpenAI API Key
CRON_SECRET=随机强密钥
```

生成随机密钥示例：

```bash
openssl rand -base64 32
```

## 7. GitHub OAuth 配置

在 GitHub 创建 OAuth App：

```txt
Homepage URL:
https://你的域名

Authorization callback URL:
https://你的域名/api/auth/callback/github
```

然后把生成的 Client ID / Client Secret 填入 `.env.production`。

## 8. 初始化 Supabase 数据库

首次部署前执行 Prisma 生产迁移：

```bash
docker compose -f deploy/docker-compose.prod.yml --profile tools run --rm migrate
```

后续每次 Schema 变更后，也执行同一条命令。

## 9. 启动服务

```bash
docker compose -f deploy/docker-compose.prod.yml up -d --build app cron caddy
```

如果只是想在本地检查 Compose 配置是否能解析，可以使用示例环境变量文件：

```bash
APP_ENV_FILE=../.env.production.example docker compose -f deploy/docker-compose.prod.yml config
```

查看服务状态：

```bash
docker compose -f deploy/docker-compose.prod.yml ps
```

查看日志：

```bash
docker compose -f deploy/docker-compose.prod.yml logs -f app
```

查看 Cron 日志：

```bash
docker compose -f deploy/docker-compose.prod.yml logs -f cron
```

## 10. 更新部署

```bash
git pull
docker compose -f deploy/docker-compose.prod.yml --profile tools run --rm migrate
docker compose -f deploy/docker-compose.prod.yml up -d --build app cron caddy
```

## 11. 停止服务

```bash
docker compose -f deploy/docker-compose.prod.yml down
```

如果需要同时删除 Caddy 证书和配置卷：

```bash
docker compose -f deploy/docker-compose.prod.yml down -v
```

注意：删除 Caddy 卷会导致证书重新申请。

## 12. 部署注意事项

- 不要提交 `.env.production`。
- 不要把 Supabase 数据库密码、OpenAI Key、GitHub Secret 写进 README 或日志。
- 生产环境使用 `npm run db:deploy`，不要使用 `npm run db:migrate`。
- 如果 Supabase 连接失败，优先确认服务器是否支持 IPv6；不确定时使用 Session Pooler。
- 如果 Caddy 证书申请失败，检查域名 DNS 是否已指向服务器 IP，以及 80 / 443 是否开放。

## 13. 参考资料

- Supabase 数据库连接方式：<https://supabase.com/docs/guides/database/connecting-to-postgres>
- Supabase IPv4 / IPv6 说明：<https://supabase.com/docs/guides/troubleshooting/supabase--your-network-ipv4-and-ipv6-compatibility-cHe3BP>

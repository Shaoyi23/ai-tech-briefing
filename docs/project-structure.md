# 项目目录结构

```txt
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── docs/
│   ├── api.md
│   ├── architecture.md
│   ├── database.md
│   ├── deployment.md
│   ├── prd.md
│   └── project-structure.md
├── deploy/
│   ├── Caddyfile
│   └── docker-compose.prod.yml
├── prisma/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── api/
│   ├── components/
│   │   ├── app/
│   │   ├── articles/
│   │   ├── feeds/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── stores/
│   ├── test/
│   └── types/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── package.json
├── prisma.config.ts
├── vercel.json
└── vitest.config.ts
```

## 页面路由

```txt
/                  -> 首页
/login             -> 登录 / 注册
/dashboard         -> Briefing 信息流
/feeds             -> RSS Feed 管理
/articles/[id]     -> 文章详情
/bookmarks         -> 收藏文章
/settings          -> 用户设置
```

## API 路由

```txt
/api/auth/[...nextauth]        -> NextAuth
/api/me                        -> 当前用户资料
/api/feed-categories           -> 分类列表 / 创建
/api/feed-categories/:id       -> 分类更新 / 删除
/api/feeds                     -> Feed 列表 / 创建
/api/feeds/:id                 -> Feed 更新 / 删除
/api/articles                  -> Briefing 列表 / 搜索
/api/articles/:id              -> 文章详情
/api/bookmarks                 -> 收藏列表 / 创建收藏
/api/bookmarks/:articleId      -> 取消收藏
/api/cron/fetch-feeds          -> Vercel Cron 抓取任务
```

## 分层原则

- `app/`：页面和 Route Handlers
- `components/`：UI 组件
- `services/`：核心业务逻辑
- `lib/`：基础设施能力
- `hooks/`：TanStack Query hooks
- `stores/`：Zustand 状态
- `types/`：共享类型定义
- `tests/`：单元测试和 service 测试
- `deploy/`：生产部署相关 Docker Compose 和 Caddy 配置

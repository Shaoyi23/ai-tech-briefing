# 系统架构设计

## 1. 总体架构

```mermaid
flowchart TB
  User["用户 / Developer"] --> Web["Next.js App Router 前端"]

  Web --> Auth["NextAuth 认证层"]
  Web --> API["Next.js Route Handlers"]

  Auth --> GitHub["GitHub OAuth"]
  Auth --> DB["PostgreSQL"]

  API --> DB
  API --> OpenAI["OpenAI SDK"]

  Cron["Vercel Cron 每小时"] --> CronAPI["/api/cron/fetch-feeds"]
  CronAPI --> FeedFetcher["Feed 抓取服务"]
  FeedFetcher --> RSS["RSS / 官方博客 / GitHub Release / HN"]
  FeedFetcher --> DB
  FeedFetcher --> SummaryJob["AI 摘要生成服务"]
  SummaryJob --> OpenAI
  SummaryJob --> DB
```

## 2. 核心模块

```mermaid
flowchart LR
  subgraph Frontend["Frontend: Next.js + TailwindCSS + shadcn/ui"]
    Login["Login"]
    Dashboard["Dashboard"]
    FeedMgmt["Feed Management"]
    ArticleDetail["Article Detail"]
    Bookmarks["Bookmarks"]
    Settings["Settings"]
  end

  subgraph Backend["Backend: Route Handlers"]
    AuthAPI["Auth APIs"]
    FeedAPI["Feed APIs"]
    ArticleAPI["Article APIs"]
    BookmarkAPI["Bookmark APIs"]
    SearchAPI["Search APIs"]
    CronAPI["Cron APIs"]
  end

  subgraph Domain["Domain Services"]
    FeedService["Feed Service"]
    ArticleService["Article Service"]
    SummaryService["AI Summary Service"]
    SearchService["Search Service"]
  end

  subgraph Infra["Infrastructure"]
    DB["PostgreSQL + Prisma"]
    AI["OpenAI SDK"]
    Cron["Vercel Cron"]
  end

  Frontend --> Backend
  Backend --> Domain
  Domain --> Infra
```

## 3. 内容抓取流程

```mermaid
sequenceDiagram
  participant Cron as Vercel Cron
  participant API as Cron Route Handler
  participant Feed as Feed Fetcher
  participant DB as PostgreSQL
  participant AI as OpenAI
  participant Summary as Summary Service

  Cron->>API: 每小时调用 /api/cron/fetch-feeds
  API->>DB: 查询所有启用的 Feed
  API->>Feed: 抓取 RSS 内容
  Feed->>DB: 根据 URL / Guid / 标题去重
  Feed->>DB: 写入新 Article
  API->>Summary: 为新文章生成摘要
  Summary->>AI: 请求三句话摘要、观点、关键词、中文标题
  AI-->>Summary: 返回结构化摘要
  Summary->>DB: 写入 ArticleSummary
  API-->>Cron: 返回抓取结果
```

## 4. 用户访问流程

```mermaid
sequenceDiagram
  participant User as User
  participant Web as Next.js Frontend
  participant Auth as NextAuth
  participant API as Route Handlers
  participant DB as PostgreSQL

  User->>Web: 访问 Dashboard
  Web->>Auth: 校验登录状态
  Auth->>DB: 查询 Session / User
  Auth-->>Web: 返回用户身份
  Web->>API: 请求 Briefing 列表
  API->>DB: 查询用户 Feed 关联文章
  DB-->>API: 返回文章与 AI 摘要
  API-->>Web: 返回分页数据
  Web-->>User: 展示 Briefing 卡片
```

## 5. 部署架构

```mermaid
flowchart TB
  GitHubRepo["GitHub Repository"] --> Vercel["Vercel Deployment"]

  Vercel --> NextApp["Next.js App"]
  Vercel --> Cron["Vercel Cron"]

  NextApp --> RouteHandlers["Route Handlers"]
  RouteHandlers --> Postgres["PostgreSQL"]
  RouteHandlers --> OpenAI["OpenAI API"]
  RouteHandlers --> GitHubOAuth["GitHub OAuth"]

  Cron --> RouteHandlers
```

## 6. 架构边界

- MVP 采用单体 Next.js 架构
- 前端页面、API、认证、Cron 入口在同一个 Next.js 项目中
- 业务逻辑放在 `src/services/`
- 数据访问统一通过 Prisma
- AI 调用封装为独立服务，便于后续替换模型或加入队列
- Cron 接口需要鉴权
- 抓取和 AI 摘要失败不影响用户访问已有 Briefing

## 7. V2 预留点

- AI 问答：增加检索服务和问答 API
- 邮件日报：增加邮件发送服务和每日 Cron
- 趋势分析：增加统计任务和趋势表
- 向量搜索：增加 embedding 字段或独立 `ArticleEmbedding` 表

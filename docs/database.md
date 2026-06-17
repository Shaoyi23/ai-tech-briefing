# 数据库设计

当前 MVP 使用 Supabase PostgreSQL 作为可选数据库。

如果没有配置 Supabase 环境变量，后端会继续使用：

```txt
src/data/mock.ts
```

## 初始化 SQL

建表脚本位于：

```txt
supabase/schema.sql
```

使用方式：

1. 打开 Supabase 项目后台
2. 进入 `SQL Editor`
3. 复制 `supabase/schema.sql`
4. 点击 `Run`

## 当前表

### feeds

订阅源表。

核心字段：

- `id`
- `title`
- `category`
- `url`
- `status`
- `article_count`
- `created_at`
- `updated_at`

### articles

文章表。

核心字段：

- `id`
- `feed_id`
- `title`
- `translated_title`
- `source`
- `category`
- `published_at`
- `summary`
- `key_points`
- `keywords`
- `url`
- `bookmarked`
- `created_at`
- `updated_at`

## 权限策略

当前 `feeds` 和 `articles` 都是公开技术内容：

- 已启用 RLS
- `anon` 和 `authenticated` 只允许读取
- 写入、更新、删除不开放给前端
- 服务端可以使用 `SUPABASE_SERVICE_ROLE_KEY` 执行后续数据写入

## 后续接入顺序

建议按这个顺序继续扩展：

1. 从 Supabase 读取真实文章
2. 从 Supabase 读取订阅源
3. 新增订阅源写入接口
4. 新增 RSS 抓取任务
5. 新增 AI 摘要表
6. 新增用户系统和收藏关系表

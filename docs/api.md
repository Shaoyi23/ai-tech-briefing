# API 设计

当前版本使用 Express 提供轻量 API。未配置 Supabase 时，接口返回 `src/data/mock.ts` 中的模拟数据。

## 通用响应

成功响应：

```json
{
  "data": [],
  "meta": {
    "dataSource": "mock"
  }
}
```

失败响应：

```json
{
  "error": {
    "code": "SUPABASE_QUERY_FAILED",
    "message": "读取文章失败，请检查 Supabase 表结构和环境变量。"
  }
}
```

## 健康检查

```http
GET /api/health
```

返回：

```json
{
  "status": "ok",
  "dataSource": "mock",
  "timestamp": "2026-06-17T00:00:00.000Z"
}
```

## 文章列表

```http
GET /api/articles
```

查询参数：

- `search`：可选，搜索标题、摘要、来源和关键词
- `category`：可选，默认 `全部`
- `bookmarked`：可选，传 `true` 时只返回收藏文章

返回字段：

- `id`
- `title`
- `translatedTitle`
- `source`
- `category`
- `publishedAt`
- `summary`
- `keyPoints`
- `keywords`
- `url`
- `bookmarked`

## 订阅源列表

```http
GET /api/feeds
```

未配置 Supabase 时返回 mock 数据。配置 Supabase 后读取 `feeds` 表。

返回字段：

- `id`
- `title`
- `category`
- `url`
- `status`
- `articleCount`

## 新增订阅源

```http
POST /api/feeds
```

请求体：

```json
{
  "title": "React 官方博客",
  "category": "前端",
  "url": "https://react.dev/blog/rss.xml",
  "status": "正常"
}
```

说明：

- `title` 必填
- `category` 必填
- `url` 必填，必须是合法 URL
- `status` 可选，只允许 `正常` 或 `暂停`

## 更新订阅源

```http
PATCH /api/feeds/:id
```

请求体可以传部分字段：

```json
{
  "status": "暂停"
}
```

## 删除订阅源

```http
DELETE /api/feeds/:id
```

成功时返回：

```http
204 No Content
```

## 后续再做

等 RSS 抓取和用户系统稳定后再增加：

```http
POST /api/bookmarks
DELETE /api/bookmarks/:articleId
```

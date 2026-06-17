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

当前返回 mock 数据，后续再接 Supabase。

## 后续再做

等数据库稳定后再增加：

```http
POST /api/feeds
DELETE /api/feeds/:id
POST /api/bookmarks
DELETE /api/bookmarks/:articleId
```

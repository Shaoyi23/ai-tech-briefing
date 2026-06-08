# API 设计

## 1. 通用约定

Base URL：

```txt
/api
```

当前 MVP 采用单用户模式，业务接口不需要登录。

如果配置了 `CRON_SECRET`，Cron 接口使用服务端密钥保护；未配置时允许内网或本地直接调用：

```http
Authorization: Bearer ${CRON_SECRET}
```

通用成功响应：

```json
{
  "data": {},
  "meta": {}
}
```

通用错误响应：

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "未授权"
  }
}
```

## 2. 错误码

| Code               | HTTP | 说明         |
| ------------------ | ---: | ------------ |
| `BAD_REQUEST`      |  400 | 请求参数错误 |
| `UNAUTHORIZED`     |  401 | 未授权       |
| `FORBIDDEN`        |  403 | 无权限       |
| `NOT_FOUND`        |  404 | 资源不存在   |
| `CONFLICT`         |  409 | 数据冲突     |
| `VALIDATION_ERROR` |  422 | 字段校验失败 |
| `INTERNAL_ERROR`   |  500 | 服务端错误   |

## 3. 分页规范

列表接口统一支持：

```txt
?page=1&pageSize=20
```

默认值：

```txt
page=1
pageSize=20
```

最大值：

```txt
pageSize=100
```

分页响应：

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

## 4. User API

```http
GET /api/me
PATCH /api/me
```

说明：

- 当前只维护一个系统用户，由服务端自动创建
- `PATCH /api/me` 仅用于修改展示昵称和头像

更新用户资料请求：

```json
{
  "name": "Lando",
  "image": "https://example.com/avatar.png"
}
```

## 5. Feed Category API

```http
GET /api/feed-categories
POST /api/feed-categories
PATCH /api/feed-categories/:id
DELETE /api/feed-categories/:id
```

创建分类请求：

```json
{
  "name": "AI",
  "description": "AI related feeds",
  "color": "#22c55e"
}
```

删除分类时，不删除 Feed，只将相关 Feed 的 `categoryId` 置空。

## 6. Feed API

```http
GET /api/feeds?categoryId=cat_123&status=ACTIVE&page=1&pageSize=20
POST /api/feeds
PATCH /api/feeds/:id
DELETE /api/feeds/:id
```

添加 Feed 请求：

```json
{
  "url": "https://react.dev/rss.xml",
  "categoryId": "cat_123"
}
```

服务端行为：

- 校验 URL 格式
- 尝试读取 RSS 元信息
- 提取默认标题
- 防止系统用户重复添加同一 URL

## 7. Article API

```http
GET /api/articles?query=react&source=React%20Blog&page=1&pageSize=20
GET /api/articles/:id
```

查询参数：

| 参数         | 类型    | 必填 | 说明                 |
| ------------ | ------- | ---- | -------------------- |
| `query`      | string  | 否   | 搜索标题、摘要、来源 |
| `source`     | string  | 否   | 来源名称             |
| `categoryId` | string  | 否   | Feed 分类            |
| `feedId`     | string  | 否   | Feed ID              |
| `bookmarked` | boolean | 否   | 是否只看收藏         |
| `page`       | number  | 否   | 页码                 |
| `pageSize`   | number  | 否   | 每页数量             |

当前实现为单用户模式，文章、Feed 和收藏都绑定到系统用户。

## 8. Bookmark API

```http
GET /api/bookmarks?query=typescript&page=1&pageSize=20
POST /api/bookmarks
DELETE /api/bookmarks/:articleId
```

收藏文章请求：

```json
{
  "articleId": "article_123"
}
```

## 9. Cron API

```http
POST /api/cron/fetch-feeds
Authorization: Bearer ${CRON_SECRET}
```

响应示例：

```json
{
  "data": {
    "feedsScanned": 12,
    "articlesCreated": 34,
    "articlesSkipped": 108,
    "summariesCreated": 31,
    "summaryFailed": 3,
    "feedFailed": 1
  }
}
```

单个 Feed 或单篇文章失败不应导致整个 Cron 失败。

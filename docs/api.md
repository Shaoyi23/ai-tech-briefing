# API 设计

当前 Vite React 版本不启用 API。

页面使用 `src/data/mock.ts` 中的本地模拟数据渲染。后续接入真实功能时，可以再恢复 API 设计。

## 后续建议

第一阶段可以只增加一个后端接口：

```http
GET /api/articles
```

返回文章列表、摘要、关键词和来源信息。

第二阶段再增加：

```http
GET /api/feeds
POST /api/feeds
DELETE /api/feeds/:id
```

等 RSS 抓取和数据库稳定后，再考虑收藏、搜索和用户系统。

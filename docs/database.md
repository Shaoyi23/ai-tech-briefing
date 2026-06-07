# 数据库设计

## 1. 数据模型

当前 Prisma Schema 位于：

```txt
prisma/schema.prisma
```

核心模型：

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `FeedCategory`
- `Feed`
- `Article`
- `ArticleSummary`
- `Bookmark`

## 2. 关系图

```mermaid
erDiagram
  User ||--o{ Account : has
  User ||--o{ Session : has
  User ||--o{ FeedCategory : owns
  User ||--o{ Feed : owns
  User ||--o{ Bookmark : creates

  FeedCategory ||--o{ Feed : groups
  Feed ||--o{ Article : publishes
  Article ||--|| ArticleSummary : has
  Article ||--o{ Bookmark : bookmarked_by

  User {
    string id PK
    string email UK
    string name
    string image
    datetime createdAt
    datetime updatedAt
  }

  FeedCategory {
    string id PK
    string userId FK
    string name
    string color
  }

  Feed {
    string id PK
    string userId FK
    string categoryId FK
    string title
    string url
    enum status
    datetime lastFetchedAt
  }

  Article {
    string id PK
    string feedId FK
    string guid
    string title
    string url
    string sourceName
    datetime publishedAt
  }

  ArticleSummary {
    string id PK
    string articleId FK
    enum status
    string translatedTitle
    string threeSentenceSummary
    string[] keyPoints
    string[] keywords
  }

  Bookmark {
    string id PK
    string userId FK
    string articleId FK
    datetime createdAt
  }
```

## 3. 关键约束

- `User.email` 唯一
- `Account.provider + Account.providerAccountId` 唯一
- `FeedCategory.userId + FeedCategory.name` 唯一
- `Feed.userId + Feed.url` 唯一
- `Article.feedId + Article.url` 唯一
- `Article.feedId + Article.guid` 唯一
- `ArticleSummary.articleId` 唯一
- `Bookmark.userId + Bookmark.articleId` 唯一

## 4. 查询索引

- Briefing 时间流：`Article.publishedAt`
- 用户 Feed 列表：`Feed.userId + Feed.status`
- 分类 Feed：`Feed.categoryId`
- 抓取去重：`Article.feedId + Article.url`、`Article.feedId + Article.guid`
- 用户收藏列表：`Bookmark.userId + Bookmark.createdAt`
- 摘要任务扫描：`ArticleSummary.status`
- Feed 抓取调度：`Feed.lastFetchedAt`

## 5. 设计说明

- `Account`、`Session`、`VerificationToken` 兼容 NextAuth Prisma Adapter
- `Feed` 绑定用户，MVP 中每个用户管理自己的 RSS 源
- `Article` 绑定 Feed，文章去重优先依赖 URL 和 Guid
- `ArticleSummary` 与 `Article` 一对一，摘要失败不影响文章存在
- `Bookmark` 是用户维度数据
- V2 向量搜索可增加 `ArticleEmbedding` 表或 embedding 字段

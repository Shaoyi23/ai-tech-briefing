-- AI Tech Briefing
-- Initial schema for running directly in Supabase SQL Editor.
-- Use this only for the first initialization of an empty database.

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TYPE "FeedStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ERROR');
CREATE TYPE "ArticleFetchStatus" AS ENUM ('PENDING', 'FETCHED', 'FAILED');
CREATE TYPE "SummaryStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FeedCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Feed" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "siteUrl" TEXT,
    "description" TEXT,
    "status" "FeedStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastFetchedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "feedId" TEXT NOT NULL,
    "guid" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "author" TEXT,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "excerpt" TEXT,
    "content" TEXT,
    "publishedAt" TIMESTAMP(3),
    "fetchStatus" "ArticleFetchStatus" NOT NULL DEFAULT 'FETCHED',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ArticleSummary" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "status" "SummaryStatus" NOT NULL DEFAULT 'PENDING',
    "translatedTitle" TEXT,
    "threeSentenceSummary" TEXT,
    "keyPoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "model" TEXT,
    "language" TEXT NOT NULL DEFAULT 'zh-CN',
    "rawResponse" JSONB,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleSummary_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

CREATE INDEX "FeedCategory_userId_idx" ON "FeedCategory"("userId");
CREATE UNIQUE INDEX "FeedCategory_userId_name_key" ON "FeedCategory"("userId", "name");

CREATE INDEX "Feed_userId_status_idx" ON "Feed"("userId", "status");
CREATE INDEX "Feed_categoryId_idx" ON "Feed"("categoryId");
CREATE INDEX "Feed_lastFetchedAt_idx" ON "Feed"("lastFetchedAt");
CREATE UNIQUE INDEX "Feed_userId_url_key" ON "Feed"("userId", "url");

CREATE INDEX "Article_feedId_publishedAt_idx" ON "Article"("feedId", "publishedAt");
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");
CREATE INDEX "Article_sourceName_idx" ON "Article"("sourceName");
CREATE INDEX "Article_title_idx" ON "Article"("title");
CREATE UNIQUE INDEX "Article_feedId_url_key" ON "Article"("feedId", "url");
CREATE UNIQUE INDEX "Article_feedId_guid_key" ON "Article"("feedId", "guid");

CREATE UNIQUE INDEX "ArticleSummary_articleId_key" ON "ArticleSummary"("articleId");
CREATE INDEX "ArticleSummary_status_idx" ON "ArticleSummary"("status");

CREATE INDEX "Bookmark_userId_createdAt_idx" ON "Bookmark"("userId", "createdAt");
CREATE INDEX "Bookmark_articleId_idx" ON "Bookmark"("articleId");
CREATE UNIQUE INDEX "Bookmark_userId_articleId_key" ON "Bookmark"("userId", "articleId");

ALTER TABLE "FeedCategory" ADD CONSTRAINT "FeedCategory_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Feed" ADD CONSTRAINT "Feed_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Feed" ADD CONSTRAINT "Feed_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "FeedCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Article" ADD CONSTRAINT "Article_feedId_fkey"
FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ArticleSummary" ADD CONSTRAINT "ArticleSummary_articleId_fkey"
FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_articleId_fkey"
FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

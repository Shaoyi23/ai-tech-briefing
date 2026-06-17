import "dotenv/config";

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  articles as mockArticles,
  feeds as mockFeeds,
  type Article,
} from "../src/data/mock.js";
import { createSupabaseServerClient, type ArticleRow } from "./supabase.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const supabase = createSupabaseServerClient();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(currentDir, "../dist");

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    dataSource: supabase ? "supabase" : "mock",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/articles", async (request, response) => {
  const search = String(request.query.search ?? "")
    .trim()
    .toLowerCase();
  const category = String(request.query.category ?? "全部");
  const bookmarked = request.query.bookmarked === "true";

  if (!supabase) {
    response.json({
      data: filterArticles(mockArticles, { search, category, bookmarked }),
      meta: { dataSource: "mock" },
    });
    return;
  }

  let query = supabase
    .from("articles")
    .select(
      "id,title,translated_title,source,category,published_at,summary,key_points,keywords,url,bookmarked",
    )
    .order("published_at", { ascending: false });

  if (category !== "全部") {
    query = query.eq("category", category);
  }

  if (bookmarked) {
    query = query.eq("bookmarked", true);
  }

  const { data, error } = await query.returns<ArticleRow[]>();

  if (error) {
    response.status(500).json({
      error: {
        code: "SUPABASE_QUERY_FAILED",
        message: "读取文章失败，请检查 Supabase 表结构和环境变量。",
      },
    });
    return;
  }

  const articles = data.map((item: ArticleRow) => ({
    id: item.id,
    title: item.title,
    translatedTitle: item.translated_title ?? item.title,
    source: item.source,
    category: item.category,
    publishedAt: item.published_at ?? "",
    summary: item.summary,
    keyPoints: item.key_points ?? [],
    keywords: item.keywords ?? [],
    url: item.url,
    bookmarked: Boolean(item.bookmarked),
  }));

  response.json({
    data: filterArticles(articles, { search, category, bookmarked }),
    meta: { dataSource: "supabase" },
  });
});

app.get("/api/feeds", (_request, response) => {
  response.json({
    data: mockFeeds,
    meta: { dataSource: "mock" },
  });
});

app.use(express.static(publicDir));

app.use((_request, response) => {
  response.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`AI 技术简报服务已启动：http://0.0.0.0:${port}`);
});

function filterArticles(
  articles: Article[],
  options: { search: string; category: string; bookmarked: boolean },
) {
  return articles.filter((article) => {
    const matchesCategory =
      options.category === "全部" || article.category === options.category;
    const matchesBookmark = !options.bookmarked || article.bookmarked;
    const text = [
      article.title,
      article.translatedTitle,
      article.source,
      article.summary,
      article.keywords.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && matchesBookmark && text.includes(options.search);
  });
}

import "dotenv/config";

import express from "express";
import path from "node:path";
import {
  articles as mockArticles,
  feeds as mockFeeds,
  type Article,
  type Feed,
} from "../src/data/mock.js";
import {
  createSupabaseServerClient,
  type ArticleRow,
  type FeedRow,
} from "./supabase.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const supabase = createSupabaseServerClient();
const publicDir = path.resolve(process.cwd(), "dist");

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

app.get("/api/feeds", async (_request, response) => {
  if (!supabase) {
    response.json({
      data: mockFeeds,
      meta: { dataSource: "mock" },
    });
    return;
  }

  const { data, error } = await supabase
    .from("feeds")
    .select("id,title,category,url,status,article_count,created_at,updated_at")
    .order("created_at", { ascending: false })
    .returns<FeedRow[]>();

  if (error) {
    response.status(500).json({
      error: {
        code: "SUPABASE_QUERY_FAILED",
        message: "读取订阅源失败，请检查 Supabase 表结构和环境变量。",
      },
    });
    return;
  }

  response.json({
    data: data.map(mapFeedRow),
    meta: { dataSource: "supabase" },
  });
});

app.post("/api/feeds", async (request, response) => {
  if (!supabase) {
    response.status(503).json({
      error: {
        code: "DATABASE_NOT_CONFIGURED",
        message: "数据库未配置，暂时不能新增订阅源。",
      },
    });
    return;
  }

  const payload = parseFeedPayload(request.body);

  if (!payload.ok) {
    response.status(400).json({
      error: {
        code: "INVALID_FEED_PAYLOAD",
        message: payload.message,
      },
    });
    return;
  }

  const { data, error } = await supabase
    .from("feeds")
    .insert({
      title: payload.feed.title,
      category: payload.feed.category,
      url: payload.feed.url,
      status: payload.feed.status,
    })
    .select("id,title,category,url,status,article_count,created_at,updated_at")
    .single<FeedRow>();

  if (error) {
    response.status(500).json({
      error: {
        code: "SUPABASE_INSERT_FAILED",
        message: "新增订阅源失败，请检查 URL 是否重复。",
      },
    });
    return;
  }

  response.status(201).json({
    data: mapFeedRow(data),
    meta: { dataSource: "supabase" },
  });
});

app.patch("/api/feeds/:id", async (request, response) => {
  if (!supabase) {
    response.status(503).json({
      error: {
        code: "DATABASE_NOT_CONFIGURED",
        message: "数据库未配置，暂时不能更新订阅源。",
      },
    });
    return;
  }

  const payload = parseFeedPayload(request.body, { partial: true });

  if (!payload.ok) {
    response.status(400).json({
      error: {
        code: "INVALID_FEED_PAYLOAD",
        message: payload.message,
      },
    });
    return;
  }

  const { data, error } = await supabase
    .from("feeds")
    .update(payload.feed)
    .eq("id", request.params.id)
    .select("id,title,category,url,status,article_count,created_at,updated_at")
    .single<FeedRow>();

  if (error) {
    response.status(500).json({
      error: {
        code: "SUPABASE_UPDATE_FAILED",
        message: "更新订阅源失败，请确认记录是否存在。",
      },
    });
    return;
  }

  response.json({
    data: mapFeedRow(data),
    meta: { dataSource: "supabase" },
  });
});

app.delete("/api/feeds/:id", async (request, response) => {
  if (!supabase) {
    response.status(503).json({
      error: {
        code: "DATABASE_NOT_CONFIGURED",
        message: "数据库未配置，暂时不能删除订阅源。",
      },
    });
    return;
  }

  const { error } = await supabase
    .from("feeds")
    .delete()
    .eq("id", request.params.id);

  if (error) {
    response.status(500).json({
      error: {
        code: "SUPABASE_DELETE_FAILED",
        message: "删除订阅源失败，请稍后重试。",
      },
    });
    return;
  }

  response.status(204).send();
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

function mapFeedRow(feed: FeedRow): Feed {
  return {
    id: feed.id,
    title: feed.title,
    category: feed.category,
    url: feed.url,
    status: feed.status,
    articleCount: feed.article_count,
  };
}

function parseFeedPayload(
  body: unknown,
  options: { partial?: boolean } = {},
):
  | { ok: true; feed: Partial<Omit<Feed, "id" | "articleCount">> }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "请求参数不能为空。" };
  }

  const input = body as Record<string, unknown>;
  const feed: Partial<Omit<Feed, "id" | "articleCount">> = {};

  if (typeof input.title === "string" && input.title.trim()) {
    feed.title = input.title.trim();
  }

  if (typeof input.category === "string" && input.category.trim()) {
    feed.category = input.category.trim();
  }

  if (typeof input.url === "string" && input.url.trim()) {
    feed.url = input.url.trim();
  }

  if (input.status === "正常" || input.status === "暂停") {
    feed.status = input.status;
  }

  if (!options.partial) {
    if (!feed.title) {
      return { ok: false, message: "订阅源名称不能为空。" };
    }

    if (!feed.category) {
      return { ok: false, message: "分类不能为空。" };
    }

    if (!feed.url) {
      return { ok: false, message: "RSS 地址不能为空。" };
    }
  }

  if (feed.url) {
    try {
      new URL(feed.url);
    } catch {
      return { ok: false, message: "RSS 地址格式不正确。" };
    }
  }

  if (!options.partial && !feed.status) {
    feed.status = "正常";
  }

  if (options.partial && Object.keys(feed).length === 0) {
    return { ok: false, message: "没有可更新的字段。" };
  }

  return { ok: true, feed };
}

import {
  useDeferredValue,
  useEffect,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { ExternalLink, RefreshCcw, Search } from "lucide-react";
import { articles, categories, feeds as mockFeeds } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Article, Feed } from "@/data/mock";

type DataSource = "api" | "mock";
type FeedDraft = {
  title: string;
  category: string;
  url: string;
};

export function App() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState(articles[0]?.id);
  const [articleList, setArticleList] = useState<Article[]>(articles);
  const [feedList, setFeedList] = useState<Feed[]>(mockFeeds);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(
      articles.filter((article) => article.bookmarked).map((item) => item.id),
    ),
  );
  const [dataSource, setDataSource] = useState<DataSource>("mock");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  async function loadArticles() {
    const response = await fetch("/api/articles");

    if (!response.ok) {
      throw new Error("文章接口请求失败");
    }

    const payload = (await response.json()) as { data?: Article[] };

    if (!Array.isArray(payload.data)) {
      throw new Error("文章接口返回格式不正确");
    }

    setArticleList(payload.data);
    setDataSource("api");
    setSelectedArticleId((current) => current ?? payload.data?.[0]?.id);
  }

  async function loadFeeds() {
    const response = await fetch("/api/feeds");

    if (!response.ok) {
      throw new Error("订阅源接口请求失败");
    }

    const payload = (await response.json()) as { data?: Feed[] };

    if (!Array.isArray(payload.data)) {
      throw new Error("订阅源接口返回格式不正确");
    }

    setFeedList(payload.data);
  }

  async function refreshData() {
    setIsRefreshing(true);

    const [articleResult, feedResult] = await Promise.allSettled([
      loadArticles(),
      loadFeeds(),
    ]);

    if (articleResult.status === "rejected") {
      setArticleList(articles);
      setDataSource("mock");
      setSelectedArticleId((current) => current ?? articles[0]?.id);
    }

    if (feedResult.status === "rejected") {
      setFeedList(mockFeeds);
    }

    setIsRefreshing(false);
  }

  useEffect(() => {
    void refreshData();
  }, []);

  const visibleArticles = articleList.filter((article) => {
    const selectedFeed = feedList.find((feed) => feed.id === selectedFeedId);
    const matchesCategory =
      selectedCategory === "全部" || article.category === selectedCategory;
    const matchesFeed = !selectedFeed || article.source === selectedFeed.title;
    const text = [
      article.title,
      article.translatedTitle,
      article.source,
      article.summary,
      article.keywords.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && matchesFeed && text.includes(deferredQuery);
  });

  const selectedArticle =
    visibleArticles.find((article) => article.id === selectedArticleId) ??
    visibleArticles[0] ??
    articleList[0];
  const selectedFeed = feedList.find((feed) => feed.id === selectedFeedId);
  const articleListTitle = selectedFeed?.title ?? selectedCategory;

  useEffect(() => {
    if (!selectedArticle) {
      return;
    }

    setSelectedArticleId(selectedArticle.id);
  }, [selectedArticle]);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const currentIndex = visibleArticles.findIndex(
        (article) => article.id === selectedArticle?.id,
      );

      if (event.key.toLowerCase() === "j") {
        const next =
          visibleArticles[
            Math.min(currentIndex + 1, visibleArticles.length - 1)
          ];
        if (next) {
          setSelectedArticleId(next.id);
        }
      }

      if (event.key.toLowerCase() === "k") {
        const next = visibleArticles[Math.max(currentIndex - 1, 0)];
        if (next) {
          setSelectedArticleId(next.id);
        }
      }

      if (event.key.toLowerCase() === "m" && selectedArticle) {
        setReadIds((current) => toggleSetValue(current, selectedArticle.id));
      }

      if (event.key.toLowerCase() === "s" && selectedArticle) {
        setSavedIds((current) => toggleSetValue(current, selectedArticle.id));
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [selectedArticle, visibleArticles]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-5">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              AI 技术简报
            </h1>
            <p className="text-xs text-muted-foreground">
              三栏阅读器 · {dataSource === "api" ? "真实接口" : "模拟数据"}
            </p>
          </div>
          <div className="flex w-full items-center gap-2 lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 rounded-lg border-border bg-card pl-9 text-sm"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索标题、摘要或来源"
                value={query}
              />
            </div>
            <Button
              className="h-10 shrink-0 rounded-lg"
              disabled={isRefreshing}
              onClick={() => void refreshData()}
              type="button"
              variant="outline"
            >
              <RefreshCcw
                className={cn("size-4", isRefreshing ? "animate-spin" : "")}
              />
              刷新
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1480px] gap-0 lg:h-[calc(100vh-65px)] lg:grid-cols-[248px_minmax(360px,460px)_minmax(0,1fr)]">
        <SourceSidebar
          feeds={feedList}
          selectedCategory={selectedCategory}
          selectedFeedId={selectedFeedId}
          onFeedsChange={setFeedList}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setSelectedFeedId(null);
          }}
          onSelectFeed={setSelectedFeedId}
        />
        <ArticleList
          articles={visibleArticles}
          title={articleListTitle}
          readIds={readIds}
          savedIds={savedIds}
          selectedArticleId={selectedArticle?.id}
          onSelectArticle={(article) => {
            setSelectedArticleId(article.id);
            setReadIds((current) => new Set(current).add(article.id));
          }}
        />
        <ReaderPane
          article={selectedArticle}
          isRead={selectedArticle ? readIds.has(selectedArticle.id) : false}
          isSaved={selectedArticle ? savedIds.has(selectedArticle.id) : false}
          onToggleRead={() => {
            if (selectedArticle) {
              setReadIds((current) =>
                toggleSetValue(current, selectedArticle.id),
              );
            }
          }}
          onToggleSaved={() => {
            if (selectedArticle) {
              setSavedIds((current) =>
                toggleSetValue(current, selectedArticle.id),
              );
            }
          }}
        />
      </main>
    </div>
  );
}

function SourceSidebar({
  feeds,
  selectedCategory,
  selectedFeedId,
  onFeedsChange,
  onSelectCategory,
  onSelectFeed,
}: {
  feeds: Feed[];
  selectedCategory: string;
  selectedFeedId: string | null;
  onFeedsChange: Dispatch<SetStateAction<Feed[]>>;
  onSelectCategory: (category: string) => void;
  onSelectFeed: (feedId: string | null) => void;
}) {
  const [draft, setDraft] = useState<FeedDraft>({
    title: "",
    category: "",
    url: "",
  });
  const [message, setMessage] = useState("订阅源已接入接口");
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreateFeed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("正在保存...");

    try {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, status: "正常" }),
      });
      const payload = (await response.json()) as {
        data?: Feed;
        error?: { message?: string };
      };

      if (!response.ok || !payload.data) {
        throw new Error(payload.error?.message ?? "新增订阅源失败。");
      }

      onFeedsChange((current) => [payload.data!, ...current]);
      setDraft({ title: "", category: "", url: "" });
      setMessage("已添加订阅源");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "新增订阅源失败。");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteFeed(feed: Feed) {
    setMessage("正在删除...");

    try {
      const response = await fetch(`/api/feeds/${feed.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as {
          error?: { message?: string };
        };
        throw new Error(payload.error?.message ?? "删除订阅源失败。");
      }

      onFeedsChange((current) => current.filter((item) => item.id !== feed.id));
      setMessage("已删除订阅源");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除订阅源失败。");
    }
  }

  return (
    <aside className="border-b border-border bg-sidebar/55 px-4 py-4 lg:h-full lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
      <div className="mb-6">
        <div className="text-sm font-semibold tracking-tight">信息源</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {feeds.length} 个订阅源
        </div>
      </div>

      <nav className="grid gap-1">
        {categories.map((category) => (
          <button
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
              selectedCategory === category
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
            )}
            key={category}
            onClick={() => onSelectCategory(category)}
            type="button"
          >
            <span>{category}</span>
            <span className="text-xs">
              {category === "全部"
                ? feeds.length
                : feeds.filter((feed) => feed.category === category).length}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-7">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          订阅源
        </div>
        <div className="grid gap-1">
          {feeds.map((feed) => (
            <div
              className={cn(
                "group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-card/70 hover:text-foreground",
                selectedFeedId === feed.id
                  ? "bg-card text-foreground shadow-sm"
                  : "",
              )}
              key={feed.id}
            >
              <button
                className="min-w-0 flex-1 truncate text-left"
                onClick={() =>
                  onSelectFeed(selectedFeedId === feed.id ? null : feed.id)
                }
                title={feed.title}
                type="button"
              >
                {feed.title}
              </button>
              <span className="text-xs">{feed.articleCount}</span>
              <button
                className="text-xs opacity-0 transition group-hover:opacity-100"
                onClick={() => void handleDeleteFeed(feed)}
                type="button"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </div>

      <form className="mt-7 grid gap-2" onSubmit={handleCreateFeed}>
        <div className="text-xs font-medium text-muted-foreground">
          添加 RSS
        </div>
        <Input
          className="h-9 bg-card text-sm"
          onChange={(event) =>
            setDraft((current) => ({ ...current, title: event.target.value }))
          }
          placeholder="名称"
          required
          value={draft.title}
        />
        <Input
          className="h-9 bg-card text-sm"
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              category: event.target.value,
            }))
          }
          placeholder="分类"
          required
          value={draft.category}
        />
        <Input
          className="h-9 bg-card text-sm"
          onChange={(event) =>
            setDraft((current) => ({ ...current, url: event.target.value }))
          }
          placeholder="RSS 地址"
          required
          type="url"
          value={draft.url}
        />
        <Button className="h-9 rounded-lg" disabled={isSaving} type="submit">
          {isSaving ? "保存中" : "添加订阅源"}
        </Button>
        <p className="text-xs leading-5 text-muted-foreground">{message}</p>
      </form>
    </aside>
  );
}

function ArticleList({
  articles,
  title,
  readIds,
  savedIds,
  selectedArticleId,
  onSelectArticle,
}: {
  articles: Article[];
  title: string;
  readIds: Set<string>;
  savedIds: Set<string>;
  selectedArticleId?: string;
  onSelectArticle: (article: Article) => void;
}) {
  return (
    <section className="border-b border-border bg-background lg:h-full lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="sticky top-[65px] z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:top-0">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {articles.length} 条结果 · J/K 切换
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-3">
        {articles.map((article) => {
          const isRead = readIds.has(article.id);
          const isSelected = selectedArticleId === article.id;

          return (
            <button
              className={cn(
                "rounded-xl border border-transparent bg-card px-4 py-3 text-left transition hover:border-border",
                isSelected ? "border-primary/35 ring-1 ring-primary/25" : "",
                isRead ? "opacity-60" : "",
              )}
              key={article.id}
              onClick={() => onSelectArticle(article)}
              type="button"
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    isRead ? "bg-transparent" : "bg-primary",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "line-clamp-2 text-[15px] leading-snug tracking-tight",
                      isRead ? "font-medium" : "font-semibold",
                    )}
                  >
                    {article.translatedTitle}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>·</span>
                    <span>{article.publishedAt}</span>
                    {savedIds.has(article.id) ? <span>· 已收藏</span> : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {article.summary}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {articles.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            没有匹配的文章，换个关键词试试看。
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ReaderPane({
  article,
  isRead,
  isSaved,
  onToggleRead,
  onToggleSaved,
}: {
  article?: Article;
  isRead: boolean;
  isSaved: boolean;
  onToggleRead: () => void;
  onToggleSaved: () => void;
}) {
  if (!article) {
    return (
      <section className="grid min-h-[50vh] place-items-center px-6 text-sm text-muted-foreground lg:h-full">
        请选择一篇文章开始阅读。
      </section>
    );
  }

  return (
    <article className="bg-card lg:h-full lg:overflow-y-auto">
      <div className="mx-auto max-w-[740px] px-5 py-8 md:px-8 lg:py-12">
        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{article.source}</span>
          <span>·</span>
          <span>{article.publishedAt}</span>
          <span>·</span>
          <span>{isRead ? "已读" : "未读"}</span>
        </div>

        <h2 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {article.translatedTitle}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          原标题：{article.title}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {article.keywords.map((keyword) => (
            <Badge className="rounded-md" key={keyword} variant="outline">
              {keyword}
            </Badge>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Button onClick={onToggleRead} type="button" variant="outline">
            {isRead ? "标为未读" : "标为已读"}
          </Button>
          <Button onClick={onToggleSaved} type="button" variant="outline">
            {isSaved ? "取消收藏" : "收藏"}
          </Button>
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            href={article.url}
            rel="noreferrer"
            target="_blank"
          >
            查看原文
            <ExternalLink className="size-4" />
          </a>
        </div>

        <div className="mt-10 space-y-7 text-[17px] leading-[1.75] text-card-foreground">
          <p>{article.summary}</p>
          <section>
            <h3 className="mb-3 text-base font-semibold">核心观点</h3>
            <ul className="space-y-3">
              {article.keyPoints.map((point) => (
                <li className="flex gap-3" key={point}>
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-muted-foreground">
          快捷键：J 下一篇，K 上一篇，M 标记已读，S 收藏。
        </div>
      </div>
    </article>
  );
}

function toggleSetValue(values: Set<string>, value: string) {
  const next = new Set(values);

  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }

  return next;
}

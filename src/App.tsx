import { useDeferredValue, useState } from "react";
import {
  Bookmark,
  ExternalLink,
  Newspaper,
  Rss,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { articles, categories, feeds } from "@/data/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Article } from "@/data/mock";

type View = "briefing" | "feeds" | "bookmarks" | "settings";

const navItems: Array<{ id: View; label: string; icon: typeof Newspaper }> = [
  { id: "briefing", label: "技术简报", icon: Newspaper },
  { id: "feeds", label: "订阅源", icon: Rss },
  { id: "bookmarks", label: "收藏", icon: Bookmark },
  { id: "settings", label: "设置", icon: Settings },
];

export function App() {
  const [view, setView] = useState<View>("briefing");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleArticles = articles.filter((article) => {
    const matchesCategory =
      category === "全部" || article.category === category;
    const matchesView = view !== "bookmarks" || article.bookmarked;
    const text = [
      article.title,
      article.translatedTitle,
      article.source,
      article.summary,
      article.keywords.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && matchesView && text.includes(deferredQuery);
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-sidebar px-5 py-6 text-sidebar-foreground lg:block">
          <Brand />
          <nav className="mt-10 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-sidebar-foreground/70 transition",
                  view === item.id
                    ? "bg-white/10 text-sidebar-foreground"
                    : "hover:bg-white/8 hover:text-sidebar-foreground",
                )}
                key={item.id}
                onClick={() => setView(item.id)}
                type="button"
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-5 md:px-8">
            <Header view={view} onChangeView={setView} />
            {view === "briefing" || view === "bookmarks" ? (
              <BriefingView
                category={category}
                onCategoryChange={setCategory}
                onQueryChange={setQuery}
                query={query}
                title={view === "bookmarks" ? "我的收藏" : "今日技术简报"}
                articles={visibleArticles}
              />
            ) : null}
            {view === "feeds" ? <FeedsView /> : null}
            {view === "settings" ? <SettingsView /> : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
        AI
      </div>
      <div>
        <div className="font-semibold tracking-tight">AI 技术简报</div>
        <div className="text-xs text-sidebar-foreground/58">
          开发者情报工作台
        </div>
      </div>
    </div>
  );
}

function Header({
  view,
  onChangeView,
}: {
  view: View;
  onChangeView: (view: View) => void;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-4">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="hidden lg:block">
          <div className="text-sm text-muted-foreground">
            当前版本使用模拟数据
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            AI 技术简报
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 lg:hidden">
        {navItems.map((item) => (
          <button
            className={cn(
              "flex h-11 items-center justify-center rounded-lg border border-border text-xs",
              view === item.id
                ? "bg-sidebar text-sidebar-foreground"
                : "bg-card",
            )}
            key={item.id}
            onClick={() => onChangeView(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
        <Sparkles className="size-4 text-primary" />
        <span>静态前端已就绪，后端功能后续逐步接入</span>
      </div>
    </header>
  );
}

function BriefingView({
  articles,
  category,
  onCategoryChange,
  onQueryChange,
  query,
  title,
}: {
  articles: Article[];
  category: string;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  query: string;
  title: string;
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              先用模拟数据验证整体信息流、搜索、分类和收藏体验。后续接入真实 RSS
              抓取时，页面结构可以继续沿用。
            </p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="搜索标题、摘要或来源"
              value={query}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                category === item
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
              key={item}
              onClick={() => onCategoryChange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
          {articles.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                暂时没有匹配的文章，换个关键词试试看。
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <aside className="grid h-fit gap-4">
        <StatCard label="今日文章" value="24" />
        <StatCard label="已收藏" value="2" />
        <StatCard label="订阅源" value={String(feeds.length)} />
      </aside>
    </section>
  );
}

function ArticleCard({ article }: { article: (typeof articles)[number] }) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{article.source}</span>
            <span>·</span>
            <span>{article.publishedAt}</span>
          </div>
          <Badge variant={article.bookmarked ? "default" : "outline"}>
            {article.bookmarked ? "已收藏" : "未收藏"}
          </Badge>
        </div>
        <div>
          <CardTitle className="text-xl leading-snug">
            {article.translatedTitle}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <p className="text-sm leading-7 text-card-foreground/80">
          {article.summary}
        </p>
        <div className="grid gap-2 rounded-lg bg-muted/70 p-4">
          {article.keyPoints.map((point) => (
            <div className="flex gap-2 text-sm" key={point}>
              <span className="mt-2 size-1.5 rounded-full bg-primary" />
              <span>{point}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
          <a
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            href={article.url}
            rel="noreferrer"
            target="_blank"
          >
            查看原文
            <ExternalLink className="size-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function FeedsView() {
  return (
    <section className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">订阅源管理</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          当前展示模拟订阅源。真实新增、删除和抓取功能会在后续版本接入。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {feeds.map((feed) => (
          <Card key={feed.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{feed.title}</CardTitle>
                  <p className="mt-2 break-all text-sm text-muted-foreground">
                    {feed.url}
                  </p>
                </div>
                <Badge>{feed.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">{feed.category}</span>
              <span>{feed.articleCount} 篇文章</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SettingsView() {
  return (
    <section className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>项目状态</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            当前版本是 Vite React
            静态前端，不连接数据库，也不需要登录。部署到服务器后可以直接访问页面，后续再逐步接入
            RSS 抓取、AI 摘要和持久化存储。
          </p>
          <Button className="w-fit" type="button">
            当前无需配置
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

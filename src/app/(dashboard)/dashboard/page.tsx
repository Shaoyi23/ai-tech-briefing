import { ArticleList } from "@/components/articles/article-list";
import { ArticleSearch } from "@/components/articles/article-search";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <PageHeader
            description="按发布时间倒序聚合你订阅的技术文章，并展示 AI 生成的中文摘要。"
            title="Today Briefing"
          />
          <ArticleSearch />
        </div>
        <ArticleList />
      </section>
      <aside className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>抓取状态</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span>下一次 Cron</span>
              <Badge>每小时</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>摘要模型</span>
              <span className="font-mono text-muted-foreground">
                gpt-4o-mini
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>去重策略</span>
              <span className="text-muted-foreground">Feed + URL</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>分类</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["Frontend", "AI", "Cloud", "OpenAI", "Next.js"].map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

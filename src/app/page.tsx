import Link from "next/link";
import { ArrowRight, Rss, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-16">
        <div className="flex max-w-3xl flex-col gap-7">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            每天 10 分钟，读完 AI 技术世界的关键更新。
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            订阅 React、TypeScript、OpenAI、Vercel 等技术主题，系统自动抓取 RSS
            并生成中文技术简报。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg">
                进入 Briefing
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/feeds">
              <Button size="lg" variant="outline">
                管理 Feeds
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["RSS 聚合", "按分类管理多个技术信息源", Rss],
            ["AI 摘要", "三句话摘要、观点、关键词、中文标题", Sparkles],
            ["每日 Briefing", "按时间排序展示最新技术动态", ArrowRight],
          ].map(([title, text, Icon]) => (
            <Card key={title as string}>
              <CardContent className="flex flex-col gap-4 p-6">
                <Icon className="text-primary" />
                <div>
                  <h2 className="font-semibold">{title as string}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {text as string}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

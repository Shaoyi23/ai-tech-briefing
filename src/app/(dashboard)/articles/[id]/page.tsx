import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/dashboard">
        <Button variant="ghost">
          <ArrowLeft data-icon="inline-start" />
          返回 Briefing
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Article ID: {id}</Badge>
            <Badge>AI Summary</Badge>
          </div>
          <CardTitle className="text-3xl leading-tight">
            React Compiler 最新进展
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 text-sm leading-7">
          <p>
            React 团队继续推进编译器稳定性，重点改善大型应用中的推断表现。
            开发者可以期待更少手写 memo 的工作量，同时保留清晰的组件模型。
            对团队而言，这意味着性能优化会更靠近默认能力。
          </p>
          <div>
            <h2 className="mb-3 font-semibold">核心观点</h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-muted-foreground">
              <li>编译器会继续减少手动性能优化负担。</li>
              <li>团队应关注代码模式是否符合编译器预期。</li>
              <li>MVP 后续可将详情页接入真实文章 API。</li>
            </ul>
          </div>
          <a
            className="inline-flex items-center gap-2 font-medium text-primary"
            href="https://react.dev"
            rel="noreferrer"
            target="_blank"
          >
            阅读原文
            <ExternalLink data-icon="inline-end" />
          </a>
        </CardContent>
      </Card>
    </article>
  );
}

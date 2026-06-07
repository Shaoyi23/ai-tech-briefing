import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/articles/bookmark-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ArticleCardProps = {
  id: string;
  title: string;
  translatedTitle?: string | null;
  sourceName: string;
  url: string;
  publishedAt?: Date | string | null;
  summary?: {
    threeSentenceSummary?: string | null;
    keywords?: string[];
  } | null;
  isBookmarked?: boolean;
};

export function ArticleCard({
  id,
  title,
  translatedTitle,
  sourceName,
  url,
  publishedAt,
  summary,
  isBookmarked = false,
}: ArticleCardProps) {
  const publishedLabel = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), {
        addSuffix: true,
        locale: zhCN,
      })
    : "未知时间";

  return (
    <Card className="overflow-hidden transition-transform hover:-translate-y-0.5">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{sourceName}</span>
            <span>·</span>
            <span>{publishedLabel}</span>
          </div>
          <CardTitle className="leading-tight">
            <Link href={`/articles/${id}`}>{translatedTitle || title}</Link>
          </CardTitle>
          {translatedTitle ? (
            <p className="text-sm text-muted-foreground">{title}</p>
          ) : null}
        </div>
        <BookmarkButton bookmarked={isBookmarked} />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm leading-7 text-card-foreground/78">
          {summary?.threeSentenceSummary ?? "摘要生成中，稍后刷新即可查看。"}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(summary?.keywords ?? []).slice(0, 5).map((keyword) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
          <a
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            href={url}
            rel="noreferrer"
            target="_blank"
          >
            原文
            <ExternalLink data-icon="inline-end" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

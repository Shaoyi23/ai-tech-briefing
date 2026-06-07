import Parser from "rss-parser";
import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import { summarizeArticle } from "@/services/summary-service";

const parser = new Parser();

export async function fetchFeedsAndSummarize() {
  const prisma = getPrisma();
  const feeds = await prisma.feed.findMany({
    where: { status: "ACTIVE" },
  });

  const result = {
    feedsScanned: feeds.length,
    articlesCreated: 0,
    articlesSkipped: 0,
    summariesCreated: 0,
    summaryFailed: 0,
    feedFailed: 0,
  };

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);

      for (const item of parsed.items) {
        if (!item.link || !item.title) {
          result.articlesSkipped += 1;
          continue;
        }

        try {
          const article = await prisma.article.create({
            data: {
              feedId: feed.id,
              guid: item.guid,
              title: item.title,
              url: item.link,
              author: item.creator,
              sourceName: feed.title,
              sourceUrl: feed.siteUrl,
              excerpt: item.contentSnippet,
              content: item.content,
              publishedAt: item.isoDate ? new Date(item.isoDate) : undefined,
            },
          });

          result.articlesCreated += 1;
          const summary = await summarizeArticle(article.id);

          if (summary?.status === "COMPLETED") {
            result.summariesCreated += 1;
          } else {
            result.summaryFailed += 1;
          }
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            result.articlesSkipped += 1;
            continue;
          }

          result.summaryFailed += 1;
        }
      }

      await prisma.feed.update({
        where: { id: feed.id },
        data: {
          lastFetchedAt: new Date(),
          lastError: null,
          status: "ACTIVE",
        },
      });
    } catch (error) {
      result.feedFailed += 1;
      await prisma.feed.update({
        where: { id: feed.id },
        data: {
          lastFetchedAt: new Date(),
          lastError: error instanceof Error ? error.message : "Unknown error",
          status: "ERROR",
        },
      });
    }
  }

  return result;
}

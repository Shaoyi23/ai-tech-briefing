import { Prisma } from "@prisma/client";
import { ApiError } from "@/lib/errors";
import { getPrisma } from "@/lib/db";
import {
  type Pagination,
  paginationMeta,
  toPrismaPagination,
} from "@/lib/pagination";

export async function listArticles(
  userId: string,
  pagination: Pagination,
  filters: {
    query?: string;
    source?: string;
    categoryId?: string;
    feedId?: string;
    bookmarked?: boolean;
  },
) {
  const searchWhere = filters.query
    ? {
        OR: [
          {
            title: {
              contains: filters.query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            sourceName: {
              contains: filters.query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            summary: {
              is: {
                OR: [
                  {
                    translatedTitle: {
                      contains: filters.query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    threeSentenceSummary: {
                      contains: filters.query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              },
            },
          },
        ],
      }
    : {};

  const where: Prisma.ArticleWhereInput = {
    ...searchWhere,
    sourceName: filters.source
      ? { contains: filters.source, mode: Prisma.QueryMode.insensitive }
      : undefined,
    feed: {
      userId,
      categoryId: filters.categoryId,
      id: filters.feedId,
    },
    bookmarks: filters.bookmarked ? { some: { userId } } : undefined,
  };

  const [articles, total] = await Promise.all([
    getPrisma().article.findMany({
      where,
      ...toPrismaPagination(pagination),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        summary: true,
        feed: { select: { id: true, title: true, category: true } },
        bookmarks: { where: { userId }, select: { id: true } },
      },
    }),
    getPrisma().article.count({ where }),
  ]);

  return {
    data: articles.map((article) => ({
      ...article,
      isBookmarked: article.bookmarks.length > 0,
      bookmarks: undefined,
    })),
    meta: paginationMeta(total, pagination),
  };
}

export async function getArticleById(userId: string, id: string) {
  const article = await getPrisma().article.findFirst({
    where: {
      id,
      feed: { userId },
    },
    include: {
      summary: true,
      feed: { select: { id: true, title: true, category: true } },
      bookmarks: { where: { userId }, select: { id: true } },
    },
  });

  if (!article) {
    throw new ApiError("NOT_FOUND", "文章不存在", 404);
  }

  return {
    ...article,
    isBookmarked: article.bookmarks.length > 0,
    bookmarks: undefined,
  };
}

import { Prisma } from "@prisma/client";
import { ApiError } from "@/lib/errors";
import { getPrisma } from "@/lib/db";
import { listArticles } from "@/services/article-service";
import { type Pagination } from "@/lib/pagination";

export async function listBookmarks(
  userId: string,
  pagination: Pagination,
  filters: { query?: string },
) {
  return listArticles(userId, pagination, {
    query: filters.query,
    bookmarked: true,
  });
}

export async function createBookmark(userId: string, articleId: string) {
  const article = await getPrisma().article.findFirst({
    where: { id: articleId, feed: { userId } },
    select: { id: true },
  });

  if (!article) {
    throw new ApiError("NOT_FOUND", "文章不存在", 404);
  }

  try {
    return await getPrisma().bookmark.create({
      data: { userId, articleId },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ApiError("CONFLICT", "文章已收藏", 409);
      }
    }

    throw error;
  }
}

export async function deleteBookmark(userId: string, articleId: string) {
  await getPrisma().bookmark.deleteMany({
    where: { userId, articleId },
  });

  return { success: true };
}

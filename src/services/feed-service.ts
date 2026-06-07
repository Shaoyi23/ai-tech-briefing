import Parser from "rss-parser";
import { Prisma } from "@prisma/client";
import { ApiError } from "@/lib/errors";
import { getPrisma } from "@/lib/db";
import {
  type Pagination,
  paginationMeta,
  toPrismaPagination,
} from "@/lib/pagination";

const parser = new Parser();

export async function listFeeds(
  userId: string,
  pagination: Pagination,
  filters: {
    categoryId?: string | null;
    status?: "ACTIVE" | "PAUSED" | "ERROR";
  },
) {
  const where: Prisma.FeedWhereInput = {
    userId,
    categoryId: filters.categoryId || undefined,
    status: filters.status,
  };

  const [feeds, total] = await Promise.all([
    getPrisma().feed.findMany({
      where,
      ...toPrismaPagination(pagination),
      orderBy: { createdAt: "desc" },
      include: { category: true, _count: { select: { articles: true } } },
    }),
    getPrisma().feed.count({ where }),
  ]);

  return {
    data: feeds,
    meta: paginationMeta(total, pagination),
  };
}

export async function createFeed(
  userId: string,
  input: { url: string; categoryId?: string | null },
) {
  if (input.categoryId) {
    await ensureCategoryOwner(userId, input.categoryId);
  }

  const feed = await parser.parseURL(input.url);

  try {
    return await getPrisma().feed.create({
      data: {
        userId,
        categoryId: input.categoryId ?? null,
        title: feed.title || input.url,
        url: input.url,
        siteUrl: feed.link,
        description: feed.description,
      },
      include: { category: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ApiError("CONFLICT", "该 RSS 已存在", 409);
      }
    }

    throw error;
  }
}

export async function updateFeed(
  userId: string,
  id: string,
  input: {
    title?: string;
    categoryId?: string | null;
    status?: "ACTIVE" | "PAUSED" | "ERROR";
  },
) {
  await ensureFeedOwner(userId, id);

  if (input.categoryId) {
    await ensureCategoryOwner(userId, input.categoryId);
  }

  return getPrisma().feed.update({
    where: { id },
    data: input,
    include: { category: true },
  });
}

export async function deleteFeed(userId: string, id: string) {
  await ensureFeedOwner(userId, id);

  await getPrisma().feed.delete({ where: { id } });

  return { success: true };
}

async function ensureFeedOwner(userId: string, id: string) {
  const feed = await getPrisma().feed.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!feed) {
    throw new ApiError("NOT_FOUND", "Feed 不存在", 404);
  }
}

async function ensureCategoryOwner(userId: string, categoryId: string) {
  const category = await getPrisma().feedCategory.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    throw new ApiError("NOT_FOUND", "分类不存在", 404);
  }
}

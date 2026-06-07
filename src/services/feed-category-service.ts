import { ApiError } from "@/lib/errors";
import { getPrisma } from "@/lib/db";

export async function listFeedCategories(userId: string) {
  return getPrisma().feedCategory.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { feeds: true },
      },
    },
  });
}

export async function createFeedCategory(
  userId: string,
  input: { name: string; description?: string; color?: string },
) {
  return getPrisma().feedCategory.create({
    data: {
      userId,
      name: input.name,
      description: input.description,
      color: input.color,
    },
  });
}

export async function updateFeedCategory(
  userId: string,
  id: string,
  input: { name?: string; description?: string; color?: string },
) {
  await ensureFeedCategoryOwner(userId, id);

  return getPrisma().feedCategory.update({
    where: { id },
    data: input,
  });
}

export async function deleteFeedCategory(userId: string, id: string) {
  await ensureFeedCategoryOwner(userId, id);

  await getPrisma().feedCategory.delete({
    where: { id },
  });

  return { success: true };
}

async function ensureFeedCategoryOwner(userId: string, id: string) {
  const category = await getPrisma().feedCategory.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!category) {
    throw new ApiError("NOT_FOUND", "分类不存在", 404);
  }
}

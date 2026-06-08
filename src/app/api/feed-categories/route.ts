import { NextRequest } from "next/server";
import { getAppUser } from "@/lib/app-user";
import { created, fail, ok } from "@/lib/response";
import { feedCategoryCreateSchema } from "@/lib/validations";
import {
  createFeedCategory,
  listFeedCategories,
} from "@/services/feed-category-service";

export async function GET() {
  try {
    const user = await getAppUser();
    const categories = await listFeedCategories(user.id);

    return ok(
      categories.map((category) => ({
        ...category,
        feedCount: category._count.feeds,
        _count: undefined,
      })),
    );
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAppUser();
    const input = feedCategoryCreateSchema.parse(await request.json());
    const category = await createFeedCategory(user.id, input);

    return created(category);
  } catch (error) {
    return fail(error);
  }
}

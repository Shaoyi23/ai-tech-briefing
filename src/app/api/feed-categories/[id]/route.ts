import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/response";
import { feedCategoryUpdateSchema, idSchema } from "@/lib/validations";
import {
  deleteFeedCategory,
  updateFeedCategory,
} from "@/services/feed-category-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const input = feedCategoryUpdateSchema.parse(await request.json());
    const category = await updateFeedCategory(
      user.id,
      idSchema.parse(id),
      input,
    );

    return ok(category);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const result = await deleteFeedCategory(user.id, idSchema.parse(id));

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/response";
import { idSchema } from "@/lib/validations";
import { deleteBookmark } from "@/services/bookmark-service";

type RouteContext = {
  params: Promise<{ articleId: string }>;
};

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireUser();
    const { articleId } = await context.params;
    const result = await deleteBookmark(user.id, idSchema.parse(articleId));

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

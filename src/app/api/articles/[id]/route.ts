import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { fail, ok } from "@/lib/response";
import { idSchema } from "@/lib/validations";
import { getArticleById } from "@/services/article-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const article = await getArticleById(user.id, idSchema.parse(id));

    return ok(article);
  } catch (error) {
    return fail(error);
  }
}

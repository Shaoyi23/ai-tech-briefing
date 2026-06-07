import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { getPagination } from "@/lib/pagination";
import { fail, ok } from "@/lib/response";
import { articleQuerySchema } from "@/lib/validations";
import { listArticles } from "@/services/article-service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const pagination = getPagination(request.nextUrl.searchParams);
    const filters = articleQuerySchema.parse({
      query: request.nextUrl.searchParams.get("query") ?? undefined,
      source: request.nextUrl.searchParams.get("source") ?? undefined,
      categoryId: request.nextUrl.searchParams.get("categoryId") ?? undefined,
      feedId: request.nextUrl.searchParams.get("feedId") ?? undefined,
      bookmarked: request.nextUrl.searchParams.get("bookmarked") ?? undefined,
    });
    const { data, meta } = await listArticles(user.id, pagination, filters);

    return ok(data, meta);
  } catch (error) {
    return fail(error);
  }
}

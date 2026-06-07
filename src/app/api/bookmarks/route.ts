import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { created, fail, ok } from "@/lib/response";
import { getPagination } from "@/lib/pagination";
import { bookmarkCreateSchema } from "@/lib/validations";
import { createBookmark, listBookmarks } from "@/services/bookmark-service";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const pagination = getPagination(request.nextUrl.searchParams);
    const query = request.nextUrl.searchParams.get("query") ?? undefined;
    const { data, meta } = await listBookmarks(user.id, pagination, { query });

    return ok(data, meta);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const input = bookmarkCreateSchema.parse(await request.json());
    const bookmark = await createBookmark(user.id, input.articleId);

    return created(bookmark);
  } catch (error) {
    return fail(error);
  }
}

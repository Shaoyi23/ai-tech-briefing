import { NextRequest } from "next/server";
import { getAppUser } from "@/lib/app-user";
import { created, fail, ok } from "@/lib/response";
import { getPagination } from "@/lib/pagination";
import { feedCreateSchema } from "@/lib/validations";
import { createFeed, listFeeds } from "@/services/feed-service";

export async function GET(request: NextRequest) {
  try {
    const user = await getAppUser();
    const pagination = getPagination(request.nextUrl.searchParams);
    const { data, meta } = await listFeeds(user.id, pagination, {
      categoryId: request.nextUrl.searchParams.get("categoryId"),
      status:
        (request.nextUrl.searchParams.get("status") as
          | "ACTIVE"
          | "PAUSED"
          | "ERROR"
          | null) ?? undefined,
    });

    return ok(data, meta);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAppUser();
    const input = feedCreateSchema.parse(await request.json());
    const feed = await createFeed(user.id, input);

    return created(feed);
  } catch (error) {
    return fail(error);
  }
}

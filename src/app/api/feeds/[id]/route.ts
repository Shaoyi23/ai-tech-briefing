import { NextRequest } from "next/server";
import { getAppUser } from "@/lib/app-user";
import { fail, ok } from "@/lib/response";
import { feedUpdateSchema, idSchema } from "@/lib/validations";
import { deleteFeed, updateFeed } from "@/services/feed-service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getAppUser();
    const { id } = await context.params;
    const input = feedUpdateSchema.parse(await request.json());
    const feed = await updateFeed(user.id, idSchema.parse(id), input);

    return ok(feed);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await getAppUser();
    const { id } = await context.params;
    const result = await deleteFeed(user.id, idSchema.parse(id));

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

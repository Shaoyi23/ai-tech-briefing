import { NextRequest } from "next/server";
import { getAppUser } from "@/lib/app-user";
import { getPrisma } from "@/lib/db";
import { fail, ok } from "@/lib/response";
import { profileUpdateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const user = await getAppUser();

    return ok(user);
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAppUser();
    const input = profileUpdateSchema.parse(await request.json());
    const updated = await getPrisma().user.update({
      where: { id: user.id },
      data: input,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return ok(updated);
  } catch (error) {
    return fail(error);
  }
}

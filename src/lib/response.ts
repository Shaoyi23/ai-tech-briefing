import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError, toApiError } from "@/lib/errors";

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json({ data, meta: meta ?? {} });
}

export function created<T>(data: T) {
  return NextResponse.json({ data, meta: {} }, { status: 201 });
}

export function fail(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "请求参数校验失败",
          issues: error.issues,
        },
      },
      { status: 422 },
    );
  }

  const apiError = toApiError(error);

  return NextResponse.json(
    {
      error: {
        code: apiError.code,
        message: apiError.message,
      },
    },
    { status: apiError.status },
  );
}

export function assertCronAuth(request: Request) {
  const expected = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!expected || token !== expected) {
    throw new ApiError("UNAUTHORIZED", "Cron Secret 错误", 401);
  }
}

import { NextRequest } from "next/server";
import { assertCronAuth, fail, ok } from "@/lib/response";
import { fetchFeedsAndSummarize } from "@/services/feed-fetcher-service";

export async function POST(request: NextRequest) {
  try {
    assertCronAuth(request);
    const result = await fetchFeedsAndSummarize();

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

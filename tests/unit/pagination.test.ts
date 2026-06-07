import { describe, expect, it } from "vitest";
import { paginationMeta, toPrismaPagination } from "@/lib/pagination";

describe("pagination", () => {
  it("converts page parameters to Prisma pagination", () => {
    expect(toPrismaPagination({ page: 3, pageSize: 20 })).toEqual({
      skip: 40,
      take: 20,
    });
  });

  it("creates API pagination metadata", () => {
    expect(paginationMeta(41, { page: 2, pageSize: 20 })).toEqual({
      page: 2,
      pageSize: 20,
      total: 41,
      totalPages: 3,
    });
  });
});

import { describe, expect, it } from "vitest";
import { feedCreateSchema } from "@/lib/validations";

describe("validations", () => {
  it("accepts valid feed URLs", () => {
    expect(
      feedCreateSchema.parse({ url: "https://example.com/rss.xml" }),
    ).toEqual({
      url: "https://example.com/rss.xml",
    });
  });

  it("rejects invalid feed URLs", () => {
    expect(() => feedCreateSchema.parse({ url: "not-a-url" })).toThrow();
  });
});

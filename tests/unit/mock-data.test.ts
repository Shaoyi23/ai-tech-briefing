import { describe, expect, it } from "vitest";
import { articles, categories, feeds } from "@/data/mock";

describe("mock 数据", () => {
  it("包含用于首页展示的文章和订阅源", () => {
    expect(articles.length).toBeGreaterThan(0);
    expect(feeds.length).toBeGreaterThan(0);
  });

  it("分类包含全部入口", () => {
    expect(categories[0]).toBe("全部");
  });
});

export function createArticle(overrides: Partial<{ title: string }> = {}) {
  return {
    title: "React Compiler Updates",
    ...overrides,
  };
}

import { ArticleCard } from "@/components/articles/article-card";

const sampleArticles = [
  {
    id: "sample-react",
    title: "React Compiler Updates",
    translatedTitle: "React Compiler 最新进展",
    sourceName: "React Blog",
    url: "https://react.dev",
    publishedAt: new Date().toISOString(),
    summary: {
      threeSentenceSummary:
        "React 团队继续推进编译器稳定性，重点改善大型应用中的推断表现。开发者可以期待更少手写 memo 的工作量，同时保留清晰的组件模型。对团队而言，这意味着性能优化会更靠近默认能力。",
      keywords: ["React", "Compiler", "Performance"],
    },
    isBookmarked: true,
  },
  {
    id: "sample-openai",
    title: "New OpenAI SDK Patterns",
    translatedTitle: "OpenAI SDK 新实践",
    sourceName: "OpenAI Developers",
    url: "https://platform.openai.com",
    publishedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    summary: {
      threeSentenceSummary:
        "文章介绍了结构化输出、工具调用和流式响应的组合方式。它强调将模型调用封装在服务层，避免 UI 与供应商 SDK 强耦合。MVP 可以先采用 JSON 输出，后续再升级为更复杂的 Agent 检索。",
      keywords: ["OpenAI", "SDK", "Agents"],
    },
  },
];

export function ArticleList() {
  return (
    <div className="flex flex-col gap-4">
      {sampleArticles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  );
}

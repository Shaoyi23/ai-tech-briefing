export type Article = {
  id: string;
  title: string;
  translatedTitle: string;
  source: string;
  category: string;
  publishedAt: string;
  summary: string;
  keyPoints: string[];
  keywords: string[];
  url: string;
  bookmarked: boolean;
};

export type Feed = {
  id: string;
  title: string;
  category: string;
  url: string;
  status: "正常" | "暂停";
  articleCount: number;
};

export const feeds: Feed[] = [
  {
    id: "react",
    title: "React 官方博客",
    category: "前端",
    url: "https://react.dev/blog/rss.xml",
    status: "正常",
    articleCount: 18,
  },
  {
    id: "openai",
    title: "OpenAI 新闻",
    category: "人工智能",
    url: "https://openai.com/news/rss.xml",
    status: "正常",
    articleCount: 24,
  },
  {
    id: "vercel",
    title: "Vercel 更新",
    category: "云服务",
    url: "https://vercel.com/changelog/rss",
    status: "正常",
    articleCount: 15,
  },
  {
    id: "typescript",
    title: "TypeScript 发布",
    category: "前端",
    url: "https://devblogs.microsoft.com/typescript/feed/",
    status: "暂停",
    articleCount: 9,
  },
];

export const articles: Article[] = [
  {
    id: "react-compiler",
    title: "React Compiler advances toward stable production usage",
    translatedTitle: "React 编译器正在走向稳定生产可用",
    source: "React 官方博客",
    category: "前端",
    publishedAt: "今天 09:20",
    summary:
      "React 团队继续推进编译器在真实项目中的稳定性。新版本重点改善了与现有代码模式的兼容性，并降低了迁移成本。对前端团队来说，这意味着未来性能优化会更接近默认能力。",
    keyPoints: [
      "减少手写 memo 代码",
      "提升大型应用渲染稳定性",
      "迁移路径更温和",
    ],
    keywords: ["React", "编译器", "性能优化"],
    url: "https://react.dev/blog",
    bookmarked: true,
  },
  {
    id: "openai-agents",
    title: "OpenAI improves agent tooling for production workflows",
    translatedTitle: "OpenAI 强化生产级 Agent 工具链",
    source: "OpenAI 新闻",
    category: "人工智能",
    publishedAt: "今天 07:45",
    summary:
      "OpenAI 的最新工具更新聚焦于更可靠的工具调用、状态管理和长任务执行。对于开发者来说，重点不只是模型能力，而是如何把 Agent 放进真实业务流程。生产系统需要更清晰的权限、日志和失败恢复机制。",
    keyPoints: ["工具调用更结构化", "强调可观测性", "适合复杂业务流"],
    keywords: ["OpenAI", "Agent", "工具调用"],
    url: "https://openai.com/news",
    bookmarked: false,
  },
  {
    id: "vercel-build",
    title: "Vercel introduces faster build cache behavior",
    translatedTitle: "Vercel 改进构建缓存策略",
    source: "Vercel 更新",
    category: "云服务",
    publishedAt: "昨天 18:10",
    summary:
      "Vercel 调整了构建缓存策略，让重复构建更快、更稳定。团队可以通过更少的配置获得更好的持续交付体验。对于中小型项目，默认配置已经足以覆盖大多数部署场景。",
    keyPoints: ["构建速度提升", "默认缓存更智能", "部署配置更简单"],
    keywords: ["Vercel", "部署", "缓存"],
    url: "https://vercel.com/changelog",
    bookmarked: true,
  },
  {
    id: "typescript-ergonomics",
    title: "TypeScript explores better developer ergonomics",
    translatedTitle: "TypeScript 继续改善开发者体验",
    source: "TypeScript 发布",
    category: "前端",
    publishedAt: "昨天 11:35",
    summary:
      "TypeScript 团队正在改善类型提示、错误信息和编辑器反馈。更新重点不是引入激进语法，而是减少日常开发中的理解成本。对大型代码库来说，这类体验优化会持续影响协作效率。",
    keyPoints: ["错误提示更清晰", "编辑器体验增强", "适合大型项目维护"],
    keywords: ["TypeScript", "类型系统", "开发体验"],
    url: "https://devblogs.microsoft.com/typescript/",
    bookmarked: false,
  },
];

export const categories = ["全部", "前端", "人工智能", "云服务"];

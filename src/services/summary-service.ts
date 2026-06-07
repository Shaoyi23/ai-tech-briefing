import OpenAI from "openai";
import { SummaryStatus } from "@prisma/client";
import { getPrisma } from "@/lib/db";
import { getOptionalEnv } from "@/lib/env";

let openai: OpenAI | null = null;

function getOpenAIClient() {
  const env = getOptionalEnv();

  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (!openai) {
    openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  return openai;
}

export async function summarizeArticle(articleId: string) {
  const prisma = getPrisma();
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { summary: true },
  });

  if (!article || article.summary?.status === SummaryStatus.COMPLETED) {
    return article?.summary ?? null;
  }

  await prisma.articleSummary.upsert({
    where: { articleId },
    create: { articleId, status: SummaryStatus.PENDING },
    update: { status: SummaryStatus.PENDING, lastError: null },
  });

  try {
    const env = getOptionalEnv();
    const completion = await getOpenAIClient().chat.completions.create({
      model: env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是面向开发者的技术情报编辑。只输出 JSON，字段为 translatedTitle、threeSentenceSummary、keyPoints、keywords。",
        },
        {
          role: "user",
          content: [
            `标题：${article.title}`,
            `来源：${article.sourceName}`,
            `正文：${article.content || article.excerpt || ""}`,
            "要求：中文标题翻译、三句话摘要、3-6 个核心观点、3-8 个关键词。",
          ].join("\n"),
        },
      ],
    });

    const raw = completion.choices[0]?.message.content ?? "{}";
    const parsed = JSON.parse(raw) as {
      translatedTitle?: string;
      threeSentenceSummary?: string;
      keyPoints?: string[];
      keywords?: string[];
    };

    return prisma.articleSummary.update({
      where: { articleId },
      data: {
        status: SummaryStatus.COMPLETED,
        translatedTitle: parsed.translatedTitle,
        threeSentenceSummary: parsed.threeSentenceSummary,
        keyPoints: parsed.keyPoints ?? [],
        keywords: parsed.keywords ?? [],
        model: env.OPENAI_MODEL ?? "gpt-4o-mini",
        rawResponse: parsed,
      },
    });
  } catch (error) {
    return prisma.articleSummary.update({
      where: { articleId },
      data: {
        status: SummaryStatus.FAILED,
        lastError: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}

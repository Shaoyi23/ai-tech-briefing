import { z } from "zod";

export const idSchema = z.string().min(1);

export const feedCategoryCreateSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(240).optional(),
  color: z.string().trim().max(32).optional(),
});

export const feedCategoryUpdateSchema = feedCategoryCreateSchema.partial();

export const feedCreateSchema = z.object({
  url: z.string().url(),
  categoryId: z.string().min(1).optional().nullable(),
});

export const feedUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  categoryId: z.string().min(1).optional().nullable(),
  status: z.enum(["ACTIVE", "PAUSED", "ERROR"]).optional(),
});

export const articleQuerySchema = z.object({
  query: z.string().trim().optional(),
  source: z.string().trim().optional(),
  categoryId: z.string().min(1).optional(),
  feedId: z.string().min(1).optional(),
  bookmarked: z.coerce.boolean().optional(),
});

export const bookmarkCreateSchema = z.object({
  articleId: z.string().min(1),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  image: z.string().url().optional().nullable(),
});

import { z } from "zod";

const emptyToUndefined = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, z.string().optional());

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: emptyToUndefined,
  OPENAI_MODEL: emptyToUndefined.pipe(z.string().default("gpt-4o-mini")),
  CRON_SECRET: emptyToUndefined,
});

export function getEnv() {
  return envSchema.parse(process.env);
}

export function getOptionalEnv() {
  return envSchema.partial().parse(process.env);
}

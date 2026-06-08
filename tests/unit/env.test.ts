import { describe, expect, it } from "vitest";
import { getOptionalEnv } from "@/lib/env";

describe("env parsing", () => {
  it("treats empty optional env strings as undefined", () => {
    const previousEnv = process.env;

    process.env = {
      ...previousEnv,
      DATABASE_URL: "postgresql://example",
      CRON_SECRET: "cron-secret",
      OPENAI_API_KEY: "",
    };

    const env = getOptionalEnv();

    expect(env.OPENAI_API_KEY).toBeUndefined();

    process.env = previousEnv;
  });
});

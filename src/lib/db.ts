import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not configured");
    }

    globalForPrisma.prismaPool = new Pool({ connectionString });
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg(globalForPrisma.prismaPool),
    });
  }

  return globalForPrisma.prisma;
}

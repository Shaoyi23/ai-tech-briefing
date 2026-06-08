import { getPrisma } from "@/lib/db";

export const APP_USER_ID = "system-user";

export async function getAppUser() {
  return getPrisma().user.upsert({
    where: { id: APP_USER_ID },
    update: {},
    create: {
      id: APP_USER_ID,
      name: "AI Tech Briefing",
      email: "system@ai-tech-briefing.local",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

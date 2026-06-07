import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app/app-sidebar";
import { UserMenu } from "@/components/app/user-menu";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-6 md:px-8">
          <header className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <span className="font-semibold">AI Tech Briefing</span>
            </div>
            <div className="hidden text-sm text-muted-foreground lg:block">
              Hourly AI technical intelligence briefing
            </div>
            <UserMenu image={user.image} name={user.name ?? user.email} />
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

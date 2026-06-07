import Link from "next/link";
import { Bookmark, Newspaper, Rss, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Newspaper },
  { href: "/feeds", label: "Feeds", icon: Rss },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-8 border-r border-white/10 bg-sidebar px-5 py-6 text-sidebar-foreground lg:flex">
      <Link className="flex items-center gap-3" href="/dashboard">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          AI
        </span>
        <span className="flex flex-col">
          <span className="font-semibold tracking-tight">AI Tech Briefing</span>
          <span className="text-xs text-sidebar-foreground/60">
            Developer intelligence
          </span>
        </span>
      </Link>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-sidebar-foreground/72 transition-colors hover:bg-white/8 hover:text-sidebar-foreground",
            )}
            href={item.href}
            key={item.href}
          >
            <item.icon data-icon="inline-start" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ArticleSearch() {
  return (
    <form className="relative w-full md:max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-11"
        name="query"
        placeholder="搜索标题、摘要、来源"
      />
    </form>
  );
}

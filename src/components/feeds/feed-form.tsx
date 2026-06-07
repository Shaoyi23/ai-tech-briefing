import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FeedForm() {
  return (
    <form className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 md:flex-row">
      <Input placeholder="https://example.com/feed.xml" type="url" />
      <Button type="submit">添加 RSS</Button>
    </form>
  );
}

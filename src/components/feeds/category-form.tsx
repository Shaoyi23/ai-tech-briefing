import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
  return (
    <form className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 md:flex-row">
      <Input placeholder="分类名称，例如 AI" />
      <Input placeholder="颜色，例如 #22c55e" />
      <Button type="submit" variant="secondary">
        新建分类
      </Button>
    </form>
  );
}

import { PageHeader } from "@/components/app/page-header";
import { CategoryForm } from "@/components/feeds/category-form";
import { FeedForm } from "@/components/feeds/feed-form";
import { FeedList } from "@/components/feeds/feed-list";

export default function FeedsPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        description="添加 RSS 地址、管理分类，并让系统每小时自动抓取技术文章。"
        title="Feed Management"
      />
      <FeedForm />
      <CategoryForm />
      <FeedList />
    </section>
  );
}

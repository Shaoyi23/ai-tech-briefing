import { ArticleList } from "@/components/articles/article-list";
import { ArticleSearch } from "@/components/articles/article-search";
import { PageHeader } from "@/components/app/page-header";

export default function BookmarksPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <PageHeader
          description="保存值得回看的技术文章，后续可以继续补充标签和团队共享。"
          title="Bookmarks"
        />
        <ArticleSearch />
      </div>
      <ArticleList />
    </section>
  );
}

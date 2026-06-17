-- AI 技术简报 MVP 数据表
-- 使用方式：复制本文件到 Supabase Dashboard -> SQL Editor 执行。

create extension if not exists pgcrypto;

create table if not exists public.feeds (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  url text not null unique,
  status text not null default '正常' check (status in ('正常', '暂停')),
  article_count integer not null default 0 check (article_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  feed_id uuid references public.feeds(id) on delete set null,
  title text not null,
  translated_title text,
  source text not null,
  category text not null,
  published_at timestamptz,
  summary text not null,
  key_points text[] not null default '{}',
  keywords text[] not null default '{}',
  url text not null unique,
  bookmarked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx
  on public.articles (published_at desc nulls last);

create index if not exists articles_category_idx
  on public.articles (category);

create index if not exists articles_source_idx
  on public.articles (source);

create index if not exists articles_bookmarked_idx
  on public.articles (bookmarked);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists feeds_set_updated_at on public.feeds;
create trigger feeds_set_updated_at
before update on public.feeds
for each row execute function public.set_updated_at();

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.feeds enable row level security;
alter table public.articles enable row level security;

drop policy if exists "feeds_public_read" on public.feeds;
create policy "feeds_public_read"
on public.feeds
for select
to anon, authenticated
using (true);

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read"
on public.articles
for select
to anon, authenticated
using (true);

insert into public.feeds (title, category, url, status, article_count)
values
  ('React 官方博客', '前端', 'https://react.dev/blog/rss.xml', '正常', 18),
  ('OpenAI 新闻', '人工智能', 'https://openai.com/news/rss.xml', '正常', 24),
  ('Vercel 更新', '云服务', 'https://vercel.com/changelog/rss', '正常', 15),
  ('TypeScript 发布', '前端', 'https://devblogs.microsoft.com/typescript/feed/', '暂停', 9)
on conflict (url) do update set
  title = excluded.title,
  category = excluded.category,
  status = excluded.status,
  article_count = excluded.article_count;

insert into public.articles (
  title,
  translated_title,
  source,
  category,
  published_at,
  summary,
  key_points,
  keywords,
  url,
  bookmarked
)
values
  (
    'React Compiler advances toward stable production usage',
    'React 编译器正在走向稳定生产可用',
    'React 官方博客',
    '前端',
    now() - interval '2 hours',
    'React 团队继续推进编译器在真实项目中的稳定性。新版本重点改善了与现有代码模式的兼容性，并降低了迁移成本。对前端团队来说，这意味着未来性能优化会更接近默认能力。',
    array['减少手写 memo 代码', '提升大型应用渲染稳定性', '迁移路径更温和'],
    array['React', '编译器', '性能优化'],
    'https://react.dev/blog',
    true
  ),
  (
    'OpenAI improves agent tooling for production workflows',
    'OpenAI 强化生产级 Agent 工具链',
    'OpenAI 新闻',
    '人工智能',
    now() - interval '4 hours',
    'OpenAI 的最新工具更新聚焦于更可靠的工具调用、状态管理和长任务执行。对于开发者来说，重点不只是模型能力，而是如何把 Agent 放进真实业务流程。生产系统需要更清晰的权限、日志和失败恢复机制。',
    array['工具调用更结构化', '强调可观测性', '适合复杂业务流'],
    array['OpenAI', 'Agent', '工具调用'],
    'https://openai.com/news',
    false
  ),
  (
    'Vercel introduces faster build cache behavior',
    'Vercel 改进构建缓存策略',
    'Vercel 更新',
    '云服务',
    now() - interval '1 day',
    'Vercel 调整了构建缓存策略，让重复构建更快、更稳定。团队可以通过更少的配置获得更好的持续交付体验。对于中小型项目，默认配置已经足以覆盖大多数部署场景。',
    array['构建速度提升', '默认缓存更智能', '部署配置更简单'],
    array['Vercel', '部署', '缓存'],
    'https://vercel.com/changelog',
    true
  ),
  (
    'TypeScript explores better developer ergonomics',
    'TypeScript 继续改善开发者体验',
    'TypeScript 发布',
    '前端',
    now() - interval '1 day 7 hours',
    'TypeScript 团队正在改善类型提示、错误信息和编辑器反馈。更新重点不是引入激进语法，而是减少日常开发中的理解成本。对大型代码库来说，这类体验优化会持续影响协作效率。',
    array['错误提示更清晰', '编辑器体验增强', '适合大型项目维护'],
    array['TypeScript', '类型系统', '开发体验'],
    'https://devblogs.microsoft.com/typescript/',
    false
  )
on conflict (url) do update set
  title = excluded.title,
  translated_title = excluded.translated_title,
  source = excluded.source,
  category = excluded.category,
  published_at = excluded.published_at,
  summary = excluded.summary,
  key_points = excluded.key_points,
  keywords = excluded.keywords,
  bookmarked = excluded.bookmarked;

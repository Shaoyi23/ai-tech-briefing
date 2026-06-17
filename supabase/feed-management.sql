-- 订阅源管理接口所需 SQL
-- 适用于已经运行过 supabase/schema.sql 的项目，也可以单独运行。

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

create index if not exists feeds_category_idx
  on public.feeds (category);

create index if not exists feeds_status_idx
  on public.feeds (status);

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

alter table public.feeds enable row level security;

drop policy if exists "feeds_public_read" on public.feeds;
create policy "feeds_public_read"
on public.feeds
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

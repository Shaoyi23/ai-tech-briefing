"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookmarkButton({ bookmarked }: { bookmarked: boolean }) {
  return (
    <Button aria-label="收藏文章" size="icon" type="button" variant="ghost">
      <Bookmark
        className={bookmarked ? "fill-current text-primary" : undefined}
        data-icon="inline-start"
      />
    </Button>
  );
}

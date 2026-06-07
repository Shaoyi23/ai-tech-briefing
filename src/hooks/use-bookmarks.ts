"use client";

import { useQuery } from "@tanstack/react-query";

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await fetch("/api/bookmarks");

      if (!response.ok) {
        throw new Error("Failed to load bookmarks");
      }

      return response.json();
    },
  });
}

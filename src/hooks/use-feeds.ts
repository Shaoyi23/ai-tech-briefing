"use client";

import { useQuery } from "@tanstack/react-query";

export function useFeeds() {
  return useQuery({
    queryKey: ["feeds"],
    queryFn: async () => {
      const response = await fetch("/api/feeds");

      if (!response.ok) {
        throw new Error("Failed to load feeds");
      }

      return response.json();
    },
  });
}

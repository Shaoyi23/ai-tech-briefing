"use client";

import { useQuery } from "@tanstack/react-query";

export function useArticles(query?: string) {
  return useQuery({
    queryKey: ["articles", query],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (query) {
        params.set("query", query);
      }

      const response = await fetch(`/api/articles?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to load articles");
      }

      return response.json();
    },
  });
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const feeds = [
  { title: "React Blog", category: "Frontend", status: "ACTIVE" },
  { title: "OpenAI Developers", category: "AI", status: "ACTIVE" },
  { title: "Vercel Changelog", category: "Cloud", status: "PAUSED" },
];

export function FeedList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RSS Feeds</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {feeds.map((feed) => (
          <div
            className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3"
            key={feed.title}
          >
            <div>
              <p className="font-medium">{feed.title}</p>
              <p className="text-sm text-muted-foreground">{feed.category}</p>
            </div>
            <Badge variant={feed.status === "ACTIVE" ? "secondary" : "outline"}>
              {feed.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

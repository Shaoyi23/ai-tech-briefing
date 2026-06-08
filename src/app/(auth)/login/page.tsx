import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar px-5 py-10 text-sidebar-foreground">
      <Card className="w-full max-w-md border-white/10 bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge>Coming Soon</Badge>
            <Clock3 className="text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">登录功能暂时关闭</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-7 text-muted-foreground">
            当前版本先专注验证 RSS 抓取、AI 摘要和 Briefing 阅读体验。
            账号体系与 GitHub OAuth 会在后续版本重新接入。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="sm:flex-1" href="/dashboard">
              <Button className="w-full">
                继续查看 Briefing
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
            <Link className="sm:flex-1" href="/">
              <Button className="w-full" variant="outline">
                返回首页
              </Button>
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            等后续版本恢复认证流程后，这里会重新开放 GitHub 登录。先去{" "}
            <Link className="font-medium text-primary" href="/dashboard">
              Dashboard
            </Link>{" "}
            看看当前产品形态也不错。
          </p>
          <p className="text-center text-sm text-muted-foreground">
            也可以返回{" "}
            <Link className="font-medium text-primary" href="/">
              首页
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <PageHeader
        description="管理基础资料、OAuth 绑定状态和后续通知偏好。"
        title="Settings"
      />
      <Card>
        <CardHeader>
          <CardTitle>用户资料</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input placeholder="昵称" />
            <Input placeholder="头像 URL" />
            <Button className="self-start" type="submit">
              保存设置
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

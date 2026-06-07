"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signIn("email", { email, callbackUrl: "/dashboard" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sidebar px-5 py-10 text-sidebar-foreground">
      <Card className="w-full max-w-md border-white/10 bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">登录 AI Tech Briefing</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            type="button"
          >
            <Code data-icon="inline-start" />
            使用 GitHub 登录
          </Button>
          <form className="flex flex-col gap-3" onSubmit={handleEmailLogin}>
            <Input
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
            <Button type="submit" variant="secondary">
              发送邮箱登录链接
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            首次登录会自动创建账号。返回{" "}
            <Link className="font-medium text-primary" href="/">
              首页
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

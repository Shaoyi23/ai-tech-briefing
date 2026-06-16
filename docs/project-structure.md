# 项目目录结构

```txt
.
├── deploy/
│   ├── Caddyfile
│   ├── docker-compose.prod.yml
│   ├── docker-compose.server.yml
│   └── nginx.conf
├── docs/
├── public/
├── src/
│   ├── components/
│   │   └── ui/
│   ├── data/
│   │   └── mock.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── test/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── tests/
├── Dockerfile
├── index.html
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## 运行入口

- `index.html`：浏览器入口
- `src/main.tsx`：React 挂载入口
- `src/App.tsx`：应用主界面
- `src/data/mock.ts`：模拟数据
- `src/styles.css`：全局样式和 Tailwind 主题变量

## 当前页面

当前没有路由系统，所有视图在同一个前端应用内切换：

- 技术简报
- 订阅源
- 收藏
- 设置

## 分层原则

- `src/components/ui/`：轻量 UI 基础组件
- `src/data/`：mock 数据
- `src/lib/`：通用工具函数
- `tests/`：单元测试
- `deploy/`：Docker 和 Nginx 部署配置

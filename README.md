# AutoFrontend (Next.js 15)

## 环境要求
- Node.js 20+
- npm 10+

## 本地启动（Windows / macOS / Linux）

> 你遇到的 `"next" 不是内部或外部命令`，通常是因为**还没安装依赖**，或者在终端里直接执行了 `next dev`。

请按以下顺序执行：

```bash
npm install
npm run dev
```

浏览器打开：`http://localhost:3000`

## 常用命令

```bash
npm run dev     # 启动开发环境
npm run build   # 生产构建
npm run start   # 启动生产服务
npm run lint    # 代码检查
```

## 常见问题

### 1) 提示：`'next' 不是内部或外部命令`
优先检查：
1. 是否已执行 `npm install`
2. 是否在项目根目录执行命令（包含 `package.json` 的目录）
3. 是否用 `npm run dev`（而不是直接输入 `next dev`）

如果依旧异常，可执行：

```bash
npx next dev
```

### 2) 端口占用

```bash
npm run dev -- -p 3001
```

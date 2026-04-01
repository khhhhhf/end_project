# AI 诗词项目说明

## 1. 项目简介

这是一个前后端分离的诗词创作项目，核心功能包括：

- 用户注册、登录、个人中心
- 诗词分类浏览与搜索
- 诗词详情、点赞、评论、回复
- AI 诗歌解读
- AI 创作灵感生成
- 飞花令小游戏
- 创作排行榜

后续规划中建议补充：

- 诗篇管理页面
- 对应的诗篇管理路由，用于统一管理新增、编辑、删除等操作

项目根目录包含两个主要子项目：

- `poem_ai_project`：前端，基于 Vue 3 + Vite + TypeScript + Element Plus
- `spapi-sever`：后端，基于 Express + MySQL2

## 2. 目录结构

```text
end_project/
├── README.md
├── PROJECT_HANDOFF.md
├── redme.md
├── poem_ai_project/        # 前端
└── spapi-sever/            # 后端
```

说明：

- `redme.md` 是原有的启动文档，包含完整建库 SQL 和测试账号信息。
- `README.md` 是新的快速启动说明。
- `PROJECT_HANDOFF.md` 用于后续继续开发时快速接手。

## 3. 环境要求

- Node.js 20+
- pnpm 9+（前端）
- npm 9+（后端）
- MySQL 8.0+

## 4. 数据库准备

项目当前使用 MySQL，默认数据库名为 `qw`。

数据库连接配置在：

- `spapi-sever/db/index.js`

当前代码中的默认配置：

```js
host: 'localhost'
user: 'root'
password: '12345678'
database: 'qw'
```

如果你的本地环境不同，需要先修改这里。

完整建表 SQL、初始化数据、测试账号已经保存在：

- `redme.md`

建议第一次启动项目时，先按照 `redme.md` 完成数据库初始化。

## 5. 启动后端

进入后端目录：

```bash
cd /Users/a0000/Desktop/end_project/spapi-sever
```

安装依赖：

```bash
npm install
```

启动服务：

```bash
node app.js
```

默认端口：

```text
http://127.0.0.1:3000
```

## 6. 启动前端

进入前端目录：

```bash
cd /Users/a0000/Desktop/end_project/poem_ai_project
```

安装依赖：

```bash
pnpm install
```

启动开发环境：

```bash
pnpm dev
```

默认访问地址：

```text
http://127.0.0.1:5173
```

## 7. 前后端联调说明

前端请求基地址写死在：

- `poem_ai_project/src/utils/request.ts`

当前配置为：

```ts
const baseURL = 'http://127.0.0.1:3000'
```

如果后端端口或地址变化，需要同步修改这里。

## 8. 常用命令

前端：

```bash
pnpm dev
pnpm build
pnpm type-check
pnpm lint
```

后端：

```bash
node app.js
```

说明：

- 后端 `package.json` 目前没有配置正式的开发脚本和测试脚本。
- 如果后续继续维护，建议补上 `dev`、`start`、`test` 等脚本。

## 9. 首次启动建议顺序

1. 初始化 MySQL 数据库
2. 启动后端 `spapi-sever`
3. 启动前端 `poem_ai_project`
4. 使用 `redme.md` 中的测试账号登录验证

## 10. 当前已知注意点

- 数据库密码写死在代码里，换环境时必须手动改。
- AI 接口依赖 `spapi-sever/api/kimiapi.js` 中的外部服务配置。
- 前端路由守卫只校验本地 token 是否存在，没有真正校验 token 是否有效。
- 项目里存在一些命名拼写问题，例如 `redme.md`、`spapi-sever`、`eidtPoem`、`readdComment`，后续重构时要谨慎处理兼容性。
- 如果后续要补“诗篇管理页面”，建议单独规划一个管理路由，避免把编辑、删除逻辑继续分散在个人中心或详情页中。

## 11. 推荐阅读顺序

如果后面要继续开发，建议按这个顺序阅读：

1. `README.md`
2. `PROJECT_HANDOFF.md`
3. `poem_ai_project/src/router/index.ts`
4. `poem_ai_project/src/api/`
5. `spapi-sever/router/`
6. `spapi-sever/router_handler/`

# 项目接手与后续开发说明

## 1. 项目定位

这是一个围绕“诗词浏览 + 用户创作 + AI 辅助”的 Web 项目，目标是让用户可以：

- 浏览诗词分类与作品
- 搜索作品
- 点赞、评论、回复
- 使用 AI 获取诗歌解读
- 使用 AI 获得创作灵感并发布作品
- 在个人中心管理资料、查看创作和点赞记录
- 参与飞花令小游戏

## 2. 当前技术栈

前端：

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- Axios

后端：

- Node.js
- Express
- MySQL2
- bcryptjs
- jsonwebtoken
- multer
- OpenAI SDK（用于调用 Moonshot/Kimi 接口）

## 3. 当前功能完成情况

已经可用的主要功能：

- 登录 / 注册
- 登录拦截
- 首页导航与搜索联想
- 诗词分类列表
- 分类页的经典收录和用户创作分页
- 诗词详情页
- 点赞 / 取消点赞
- 评论 / 回复评论
- AI 诗歌问答
- AI 创作灵感生成
- 提交用户创作
- 个人中心资料展示与编辑
- 我的创作 / 我的点赞
- 创作排行榜
- 飞花令小游戏

占位或可继续增强的部分：

- `AiCreate.vue` 页面仍是空壳
- 飞花令页面中的“AI 绘画”仍是占位
- 还没有独立的诗篇管理页面与对应路由
- 后端缺少测试、权限校验、环境变量管理
- 前端缺少统一错误态、加载态和接口类型约束

## 4. 前端结构速览

根目录：

- `poem_ai_project/src/main.ts`：Vue 应用入口
- `poem_ai_project/src/router/index.ts`：路由与登录守卫
- `poem_ai_project/src/utils/request.ts`：Axios 实例
- `poem_ai_project/src/stores/modules/user.ts`：用户状态持久化

页面层：

- `poem_ai_project/src/pages/LoginIndex.vue`：登录注册页
- `poem_ai_project/src/pages/UserIndex.vue`：个人中心
- `poem_ai_project/src/pages/ClassIndex.vue`：分类详情页
- `poem_ai_project/src/pages/ArticleIndex.vue`：诗词详情页
- `poem_ai_project/src/pages/home/HomeIndex.vue`：主框架页
- `poem_ai_project/src/pages/home/PoetryCenter.vue`：诗词中心
- `poem_ai_project/src/pages/home/AiCreationCenter.vue`：AI 创作中心
- `poem_ai_project/src/pages/home/FlyingFlowerGame.vue`：飞花令小游戏
- `poem_ai_project/src/pages/home/RankingList.vue`：排行榜

组件层：

- `CardItem.vue` / `CardKh.vue`：卡片承载组件
- `CommentItem.vue`：评论项
- `LikedPoemCard.vue`：点赞作品卡片
- `UserRanking.vue`：排行榜展示

接口层：

- `src/api/user.ts`：用户、排行、飞花令、个人中心相关接口
- `src/api/articleclass.ts`：分类、搜索、详情、分页接口
- `src/api/articledetail.ts`：点赞、评论、AI 解读、创作提交

## 5. 路由结构

主路由：

- `/login`
- `/user-index`
- `/article-index/:poem_id`
- `/class-index/:them_id`
- `/home-index`

`/home-index` 子路由：

- `/home-index/poetry-center`
- `/home-index/ai-create`
- `/home-index/flying-flower`
- `/home-index/ranking`

建议后续新增：

- `/poem-manage`：诗篇管理页，统一承载作品列表管理、编辑入口、删除操作等

注意：

- 分类参数名现在是 `them_id`，不是更常见的 `theme_id`。
- 路由守卫目前只判断 `Pinia` 中是否有 token，不会向后端验证 token 真伪。

## 6. 后端结构速览

入口：

- `spapi-sever/app.js`：Express 启动文件，挂载 `/api` 路由，开放 `/uploads`

路由层：

- `spapi-sever/router/user.js`
- `spapi-sever/router/poem.js`

业务层：

- `spapi-sever/router_handler/user.js`
- `spapi-sever/router_handler/poem.js`

基础设施：

- `spapi-sever/db/index.js`：MySQL 连接池
- `spapi-sever/api/kimiapi.js`：AI 相关封装

## 7. 数据表概览

主要数据表：

- `users`
- `themes`
- `poems`
- `likes`
- `comments`

关系概览：

- 一个用户可以创建多篇诗词
- 一篇诗词可以有多个点赞
- 一篇诗词可以有多个评论
- 评论支持 `parent_comment_id` 形成回复关系
- 诗词通过 `theme_id` 归属分类

完整建表 SQL 在：

- `redme.md`

## 8. 主要接口概览

用户相关：

- `POST /api/register`
- `POST /api/login`
- `GET /api/activeUser`
- `GET /api/renderProfile`
- `POST /api/updateUser`
- `GET /api/getLikedPoemsByUserId`
- `GET /api/renderCreate`
- `DELETE /api/deleteLikeById`
- `GET /api/searchfhl`
- `DELETE /api/deletecrete`
- `GET /api/eidtPoem`
- `POST /api/updatePoem`

诗词相关：

- `GET /api/category`
- `GET /api/getPoems`
- `GET /api/getpoemsall`
- `GET /api/getPoemsid`
- `GET /api/getPoemss`
- `GET /api/getPoempl`
- `POST /api/toggleLike`
- `POST /api/postPoem`
- `POST /api/addComment`
- `POST /api/readdComment`

AI 相关：

- `GET /api/aicrete`
- `GET /api/getPoemRelated`

备注：

- 接口命名中存在拼写不统一的问题，前后端目前是匹配的，重命名时需要一起改。
- 后端统一通过 `res.cc(data, code)` 返回数据，但 `code` 语义并不完全统一。

## 9. 前后端数据流

典型流程可以这样理解：

1. 用户登录后，前端将 `token`、`user_id`、`avatar_url` 等写入 Pinia。
2. 首页与分类页通过 `/api/category`、`/api/getpoemsall`、`/api/getPoems` 拉取内容。
3. 搜索框通过 `/api/getPoemsid` 进行联想搜索。
4. 详情页通过 `/api/getPoemss` 拉取作品主体，通过 `/api/getPoempl` 拉取评论。
5. 点赞通过 `/api/toggleLike` 完成。
6. 评论和回复分别走 `/api/addComment`、`/api/readdComment`。
7. AI 创作中心调用 `/api/aicrete` 获取创作方向，再调用 `/api/postPoem` 提交作品。
8. 个人中心通过 `/api/renderProfile`、`/api/renderCreate`、`/api/getLikedPoemsByUserId` 拉取用户相关数据。

## 10. 当前代码里需要优先注意的问题

### 10.1 配置写死

当前有几处配置直接写在代码里：

- 前端接口地址写死在 `poem_ai_project/src/utils/request.ts`
- 数据库账号密码写死在 `spapi-sever/db/index.js`
- Moonshot API Key 写死在 `spapi-sever/api/kimiapi.js`

建议下一步优先改为 `.env` 管理。

### 10.2 安全性不足

当前后端虽然登录时生成了 JWT，但大部分接口并没有真正做鉴权中间件校验。

这意味着：

- 只要知道接口参数，就可以直接请求很多用户相关接口
- 前端路由守卫只做了“是否存在 token”的本地判断

如果项目要继续完善，这部分建议优先补。

### 10.3 返回码不统一

当前接口返回码语义不一致：

- 大多数成功返回 `code = 0`
- 一些错误返回 `code = 1`
- `postPoem` 成功时返回了 `code = 200`
- 有些地方又用 `400`、`404`、`500` 作为业务字段值

前端 Axios 拦截器是按 `code === 1` 认定失败的，所以后续新增接口时要特别注意兼容。

### 10.4 命名不统一

已有一些拼写问题：

- `spapi-sever`
- `redme.md`
- `eidtPoem`
- `readdComment`
- `them_id`
- `aicrete`
- `promt`

这些名字目前已经贯穿前后端，贸然修改会引起联调问题。建议后续做一次“统一重命名 + 全链路回归测试”。

### 10.5 缺少工程化基础

目前还缺少：

- 后端测试
- API 文档
- 环境变量模板
- 开发 / 生产配置分离
- 数据校验规范
- 日志规范
- CI 流程
- 诗篇管理页的独立路由与页面职责划分

## 11. 推荐的后续开发顺序

如果后面继续迭代，建议按下面顺序推进：

1. 把前后端配置改成 `.env`
2. 为后端增加 JWT 鉴权中间件
3. 增加独立的诗篇管理页面和路由
4. 统一接口返回结构和状态码语义
5. 整理接口命名，逐步修正拼写问题
6. 给 AI、评论、个人中心接口补类型定义和错误处理
7. 完成空壳页面与占位功能
8. 补最基础的测试和接口文档

## 12. 如果要快速定位代码，从这里开始

想改登录流程：

- `poem_ai_project/src/pages/LoginIndex.vue`
- `poem_ai_project/src/stores/modules/user.ts`
- `spapi-sever/router_handler/user.js`

想改诗词分类和列表：

- `poem_ai_project/src/pages/home/PoetryCenter.vue`
- `poem_ai_project/src/pages/ClassIndex.vue`
- `spapi-sever/router_handler/poem.js`

想改详情页、点赞、评论：

- `poem_ai_project/src/pages/ArticleIndex.vue`
- `poem_ai_project/src/components/CommentItem.vue`
- `spapi-sever/router_handler/poem.js`

想改 AI 创作：

- `poem_ai_project/src/pages/home/AiCreationCenter.vue`
- `poem_ai_project/src/api/articledetail.ts`
- `spapi-sever/api/kimiapi.js`
- `spapi-sever/router_handler/poem.js`

想改个人中心：

- `poem_ai_project/src/pages/UserIndex.vue`
- `poem_ai_project/src/api/user.ts`
- `spapi-sever/router_handler/user.js`

# 项目启动文档

> 诗歌创作与社区应用：前端 Vue3 + Vite + Element Plus，后端 Node.js + Express，数据库 MySQL，AI 接入 Kimi（Moonshot）。

## 一、环境要求

- Node.js >= 20.19（前端要求，推荐 22 LTS）
- MySQL >= 8.0
- pnpm（前端）/ npm（后端）

---

## 二、目录结构

- `poem_ai_project/`：前端项目
- `spapi-sever/`：后端项目
- `spapi-sever/uploads/`：图片上传与主题封面（示例数据会引用）
- `redme.md`：启动与初始化说明

---

## 三、快速开始（推荐顺序）

1. 初始化数据库（见下文）
2. 启动后端
3. 启动前端

---

## 四、数据库初始化

### 1. 登录 MySQL

```bash
mysql -u root -p
```

### 2. 创建数据库

```sql
CREATE DATABASE qw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qw;
```

### 3. 建表

```sql
-- 1. 用户表
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  nickname VARCHAR(50) DEFAULT NULL,
  user_description VARCHAR(255) DEFAULT NULL
);

-- 2. 主题分类表
CREATE TABLE themes (
  theme_id INT PRIMARY KEY AUTO_INCREMENT,
  theme_name VARCHAR(50) NOT NULL,
  theme_image VARCHAR(255) DEFAULT NULL,
  theme_description VARCHAR(255) DEFAULT NULL
);

-- 3. 诗篇表
CREATE TABLE poems (
  poem_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT DEFAULT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(50) DEFAULT NULL,
  theme_id INT DEFAULT NULL,
  likes_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  FOREIGN KEY (theme_id) REFERENCES themes(theme_id) ON DELETE SET NULL
);

-- 4. 点赞表
CREATE TABLE likes (
  like_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  poem_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (poem_id) REFERENCES poems(poem_id) ON DELETE CASCADE
);

-- 5. 评论表
CREATE TABLE comments (
  comment_id INT PRIMARY KEY AUTO_INCREMENT,
  poem_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id INT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poem_id) REFERENCES poems(poem_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 4. 插入初始数据

```sql
-- 主题分类（对应 uploads/ 目录下的图片）
INSERT INTO themes (theme_name, theme_image, theme_description) VALUES
('山水', '/uploads/landscape.jpg',   '寄情山水，感悟天地之美'),
('思乡', '/uploads/homesickness.jpg','羁旅在外，魂牵梦萦故土'),
('爱情', '/uploads/love.jpg',        '千古情愫，诉不尽儿女柔情'),
('友情', '/uploads/friendship.jpg',  '高山流水，情谊深如海'),
('爱国', '/uploads/patriotism.jpg',  '热血报国，壮志凌云'),
('送别', '/uploads/parting.jpg',     '长亭外，古道边，一声珍重'),
('灵感', '/uploads/inspiration.jpg', '妙手偶得，文思泉涌');

-- 用户（密码均为 123456 的 bcrypt 哈希）
INSERT INTO users (username, password_hash, avatar_url, nickname, user_description) VALUES
('li_bai',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=libai',   '诗仙李白', '举头望明月，低头思故乡'),
('du_fu',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=dufu',    '诗圣杜甫', '安得广厦千万间，大庇天下寒士俱欢颜'),
('wang_wei', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwei', '诗佛王维', '诗中有画，画中有诗'),
('bai_juyi', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=baijuyi', '白居易',   '野火烧不尽，春风吹又生'),
('su_shi',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sushi',   '苏东坡',   '但愿人长久，千里共婵娟');

-- 管理员收录诗篇（user_id = NULL）
INSERT INTO poems (user_id, title, content, author, theme_id, likes_count, created_at) VALUES
(NULL, '静夜思',       '床前明月光，疑是地上霜。举头望明月，低头思故乡。',                                         '李白',   2, 0, '2024-01-01 08:00:00'),
(NULL, '春晓',         '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',                                         '孟浩然', 1, 0, '2024-01-02 08:00:00'),
(NULL, '登鹳雀楼',     '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',                                         '王之涣', 6, 0, '2024-01-03 08:00:00'),
(NULL, '相思',         '红豆生南国，春来发几枝。愿君多采撷，此物最相思。',                                         '王维',   3, 0, '2024-01-04 08:00:00'),
(NULL, '凉州词',       '黄河远上白云间，一片孤城万仞山。羌笛何须怨杨柳，春风不度玉门关。',                         '王之涣', 5, 0, '2024-01-05 08:00:00'),
(NULL, '饮湖上初晴后雨','水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。',                        '苏轼',   1, 0, '2024-01-06 08:00:00'),
(NULL, '赠汪伦',       '李白乘舟将欲行，忽闻岸上踏歌声。桃花潭水深千尺，不及汪伦送我情。',                         '李白',   6, 0, '2024-01-07 08:00:00'),
(NULL, '咏鹅',         '鹅鹅鹅，曲项向天歌。白毛浮绿水，红掌拨清波。',                                             '骆宾王', 4, 0, '2024-01-08 08:00:00');

-- 用户创作诗篇
INSERT INTO poems (user_id, title, content, author, theme_id, likes_count, created_at) VALUES
(1, '月下独酌',       '花间一壶酒，独酌无相亲。举杯邀明月，对影成三人。',                     '李白',   3, 0, '2024-03-01 10:00:00'),
(1, '望庐山瀑布',     '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',   '李白',   1, 0, '2024-03-05 14:00:00'),
(2, '春望',           '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。',                     '杜甫',   2, 0, '2024-03-10 09:00:00'),
(3, '山居秋暝',       '空山新雨后，天气晚来秋。明月松间照，清泉石上流。',                     '王维',   1, 0, '2024-03-12 16:00:00'),
(4, '赋得古原草送别', '离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。',                     '白居易', 6, 0, '2024-03-15 11:00:00'),
(5, '水调歌头',       '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。',                   '苏轼',   3, 0, '2024-03-18 20:00:00'),
(2, '绝句',           '两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。',   '杜甫',   1, 0, '2024-03-20 08:30:00'),
(3, '鸟鸣涧',         '人闲桂花落，夜静春山空。月出惊山鸟，时鸣春涧中。',                     '王维',   1, 0, '2024-03-22 15:00:00');

-- 点赞数据
INSERT INTO likes (user_id, poem_id) VALUES
(1,3),(1,4),(1,11),(1,14),
(2,1),(2,9),(2,13),(2,16),
(3,2),(3,5),(3,10),(3,15),
(4,6),(4,7),(4,9),(4,12),
(5,1),(5,2),(5,3),(5,11);

-- 评论数据
INSERT INTO comments (poem_id, user_id, content, parent_comment_id, created_at) VALUES
(9,  2, '李白的诗真是豪迈，每次读都热血沸腾！',        NULL, '2024-04-01 10:00:00'),
(9,  3, '同感，尤其飞流直下三千尺这句太绝了',          1,    '2024-04-01 10:30:00'),
(9,  4, '意境壮阔，千古名篇！',                        NULL, '2024-04-01 11:00:00'),
(11, 1, '读此诗如见国破之痛，令人动容',                NULL, '2024-04-02 09:00:00'),
(11, 5, '杜甫忧国忧民，诗圣之名实至名归',              4,    '2024-04-02 09:30:00'),
(12, 2, '王维的诗有种禅意，读完心里很静',              NULL, '2024-04-03 14:00:00'),
(12, 4, '明月松间照，这画面感太强了',                  NULL, '2024-04-03 15:00:00'),
(12, 1, '诗中有画，果然名不虚传',                      6,    '2024-04-03 16:00:00'),
(14, 3, '野火烧不尽，最喜欢这两句，充满生命力',        NULL, '2024-04-04 10:00:00'),
(16, 2, '苏轼这首词写得太美了，每逢中秋必读',          NULL, '2024-04-05 20:00:00'),
(16, 1, '但愿人长久，千里共婵娟，千古绝唱',            NULL, '2024-04-05 20:30:00'),
 (16, 4, '豪放派词人的代表作，无与伦比',                10,   '2024-04-05 21:00:00');
```

退出 MySQL：

```sql
exit
```

---

## 五、后端配置

### 1. 数据库连接

文件路径：`spapi-sever/db/index.js`

```js
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',  // 修改为你的 MySQL 密码
  database: 'qw',
})
```

### 2. AI Key 配置（Kimi / Moonshot）

文件路径：`spapi-sever/api/kimiapi.js`

将 `apiKey` 替换为你自己的 Key。注意：生产环境不要硬编码密钥。

---

## 六、启动后端

```bash
cd spapi-sever
npm install
node app.js
```

后端运行在 `http://localhost:3000`

---

## 七、启动前端

```bash
cd poem_ai_project
pnpm install
pnpm dev
```

前端运行在 `http://localhost:5173`

---

## 八、测试账号

| 用户名 | 密码 |
|--------|------|
| li_bai | 123456 |
| du_fu | 123456 |
| wang_wei | 123456 |
| bai_juyi | 123456 |
| su_shi | 123456 |

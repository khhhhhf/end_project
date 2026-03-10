export interface Theme {
  theme_id: number
  theme_name: string
  theme_image: string
  theme_description?: string
}

//搜索结果
export interface searchtype {
  poem_id: number
  title: string
}

// 评论类型
export interface Comment {
  // 头像图片路径
  avatar_url: string
  // 评论ID
  comment_id: number
  // 评论内容
  content: string
  // 创建时间
  created_at: string
  // 评论者昵称
  nickname: string
  // 父评论ID（null表示是一级评论）
  parent_comment_id: number | null
}

// 诗歌数据类型定义
export interface Poem {
  title: string
  author: string
  likes_count: number
  content: string | Array<string>
}

// 新类型：继承 Comment，并添加 replies
export interface NewComment extends Comment {
  replies: NewComment[] // 子评论
}

export interface userinfo {
  avatar_url: string
  token: string
  user_id: number
  username: string
}

export interface create {
  poem_id: number
  title: string
  likes_count: number
  content: string
  created_at: string // 或 Date，如果你后端返回 Date 类型
  comment_count: number
  nickname: string
}

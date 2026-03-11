import request from '@/utils/request'

//点赞/取消点赞
export const toggleLike = (user_id: number, poem_id: string | number) =>
  request.post('/api/toggleLike', { user_id, poem_id })

//发表评论
export const addcomment = (obj: object) => request.post('/api/addComment', obj)

//回复评论
export const replycomment = (obj: object) =>
  request.post('/api/readdComment', obj)

//ai问答
export const getPoemRelated = (promt: string, content: string) =>
  request.get('/api/getPoemRelated', {
    params: {
      content,
      promt
    }
  })

//ai创作提交作品
export const postPoem = (obj: object) => request.post('/api/postPoem', obj)

//获取ai生成灵感
export const aicrete = (prompt: string) =>
  request.get('/api/aicrete', {
    params: {
      prompt
    }
  })

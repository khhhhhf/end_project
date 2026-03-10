import request from '@/utils/request'

//注册账号
export const register = (obj: object) => request.post('/api/register', obj)

//登录
export const login = (obj: object) => request.post('/api/login', obj)

//获取用户制作排行榜
export const activeUser = () => request.get('/api/activeUser')

//飞花令
export const searchfhl = (obj: object) =>
  request.get('/api/searchfhl', {
    params: obj
  })

//获取用户点赞的诗篇
export const getLikedPoemsByUserId = (user_id: number) =>
  request.get('/api/getLikedPoemsByUserId', {
    params: { user_id }
  })

//更新用户信息（包括头像上传）
export const updateUserInfo = (formData: FormData) =>
  request.post('/api/updateUser', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

//获取用户详细信息（包括获赞统计）
export const renderProfile = (user_id: number) =>
  request.get('/api/renderProfile', {
    params: { user_id }
  })

//获取用户创作列表
export const renderCreate = (user_id: number) =>
  request.get('/api/renderCreate', {
    params: { user_id }
  })

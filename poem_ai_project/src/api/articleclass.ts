import request from '@/utils/request'
import type { Theme } from '@/types'

//获取诗篇分类
export const getarticleclass = () =>
  request.get<{ msg: Theme[] }>('/api/category')

//获取诗篇查询结果
export const getarticleclassresult = (keyword: string) =>
  request.get('/api/getPoemsid', {
    params: {
      keyword
    }
  })

//诗篇细节
export const poemdetai = (user_id: number, poem_id: string) =>
  request.get('/api/getPoemss', {
    params: {
      user_id,
      poem_id
    }
  })

export const getPoemp = (poem_id: string) =>
  request.get('/api/getPoempl', {
    params: {
      poem_id
    }
  })

//获取某分类下管理员收录诗篇
export const getPoems = (theme_id: number) =>
  request.get('/api/getPoems', {
    params: { theme_id }
  })

//获取诗篇分页创作
export const getpoemsall = (obj: object) =>
  request.get('/api/getpoemsall', {
    params: obj
  })

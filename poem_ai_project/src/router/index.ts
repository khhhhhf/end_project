import AiCreationCenter from '@/pages/home/AiCreationCenter.vue'
import ArticleIndex from '@/pages/ArticleIndex.vue'
import ClassIndex from '@/pages/ClassIndex.vue'
import FlyingFlowerGame from '@/pages/home/FlyingFlowerGame.vue'
import HomeIndex from '@/pages/home/HomeIndex.vue'
import RankingList from '@/pages/home/RankingList.vue'
import UserIndex from '@/pages/UserIndex.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'HomeIndex' }
    },
    {
      name: 'AiCreationCenter',
      path: '/ai-create',
      component: AiCreationCenter
    },
    {
      name: 'ArticleIndex',
      path: '/article-index/:poem_id',
      props: true,
      component: ArticleIndex
    },
    {
      name: 'ClassIndex',
      path: '/class-index/:them_id',
      props: true,
      component: ClassIndex
    },
    {
      name: 'HomeIndex',
      path: '/home-index',
      component: HomeIndex,
      redirect: { name: 'PoetryCenter' },
      children: [
        {
          name: 'PoetryCenter',
          path: 'poetry-center',
          component: () => import('@/pages/home/PoetryCenter.vue')
        },
        {
          name: 'FlyingFlowerGame',
          path: 'flying-flower',
          component: FlyingFlowerGame
        },
        {
          name: 'HomeAiCreationCenter',
          path: 'ai-create',
          component: AiCreationCenter
        },
        {
          name: 'RankingList',
          path: 'ranking',
          component: RankingList
        }
      ]
    },
    {
      name: 'UserIndex',
      path: '/user-index',
      component: UserIndex
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/pages/LoginIndex.vue')
    }
  ]
})

// GOOD
router.beforeEach((to, from, next) => {
  const userstore = useUserStore()

  const isAuthenticated = userstore.userinfo.token

  if (to.name !== 'Login' && !isAuthenticated) {
    ElMessage.error('请先完成登录')
    next({ name: 'Login' })
  } else next()
})

export default router

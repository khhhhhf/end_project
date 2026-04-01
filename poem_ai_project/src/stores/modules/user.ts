import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { userinfo } from '@/types'
import router from '@/router'

export const useUserStore = defineStore(
  'user',
  () => {
    const userinfo = ref<userinfo>({
      avatar_url: '',
      token: '',
      user_id: 0,
      username: '',
      role: ''
    })
    function getinfo(obj: userinfo) {
      userinfo.value = { ...obj }
    }
    function removeinfo() {
      router.push({ name: 'Login' })
      userinfo.value = {
        avatar_url: '',
        token: '',
        user_id: 0,
        username: '',
        role: ''
      }
      ElMessage.success('退出成功')
    }
    return { userinfo, getinfo, removeinfo }
  },
  {
    persist: true
  }
)

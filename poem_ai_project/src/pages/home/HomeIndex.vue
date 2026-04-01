<template>
  <div class="home-container">
    <el-container>
      <!-- 头部导航栏 -->
      <el-header height="60px">
        <div class="header-container">
          <!-- Logo区域 -->
          <div class="logo">
            <h1>AI Poetry Assistant</h1>
          </div>

          <!-- 搜索框 -->
          <div class="search-section">
            <el-input
              @focus="isFocus = true"
              @blur="handleBlur"
              v-model="searchText"
              placeholder="搜索..."
              class="search-input"
              :prefix-icon="Search"
              size="large"
              round
            />
            <ul v-if="searchText && isFocus" class="search-results">
              <li
                v-for="item in filteredItems"
                :key="item.poem_id"
                @click="selectItem(item.title, item.poem_id)"
              >
                {{ item.title }}
              </li>
              <li v-if="filteredItems.length === 0" class="empty">
                没有匹配结果
              </li>
            </ul>
          </div>

          <!-- 右侧导航和用户区域 -->
          <div class="right-section">
            <!-- 汉堡按钮 -->
            <el-button class="menu-toggle" @click="toggleMenu" v-show="isMobile"
              ><el-icon> <i-ep-Menu /></el-icon
            ></el-button>

            <!-- 导航菜单 -->
            <div class="nav-menu" :class="{ open: menuOpen || !isMobile }">
              <router-link
                replace
                to="/home-index/poetry-center"
                class="nav-item"
                >诗词中心</router-link
              >
              <router-link replace to="/home-index/ai-create" class="nav-item"
                >创作中心</router-link
              >
              <router-link
                replace
                to="/home-index/flying-flower"
                class="nav-item"
                >Ai小游戏</router-link
              >
              <router-link replace to="/home-index/ranking" class="nav-item"
                >创作排行榜</router-link
              >
              <router-link
                v-if="(usestore.userinfo as any).role === 'admin'"
                replace
                to="/home-index/admin"
                class="nav-item admin-nav"
                >后台管理</router-link
              >
            </div>

            <!-- 用户头像 -->
            <el-dropdown trigger="hover">
              <el-avatar
                :size="40"
                :src="baseURL + usestore.userinfo.avatar_url"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToUserPage"
                    >个人主页</el-dropdown-item
                  >
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main>
        <div class="main-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getarticleclassresult } from '@/api/articleclass'
import type { searchtype } from '../../types'
import { useUserStore } from '@/stores'
import { baseURL } from '@/utils/request'

const router = useRouter()
const searchText = ref('')
const filteredItems = ref<searchtype[]>([])
const activeIndex = ref('/home-index/poetry-center')

const isFocus = ref(false) // 控制下拉框显示
const menuOpen = ref(false)
const isMobile = ref(false)

// 路由监听
router.afterEach((to) => {
  activeIndex.value = to.path
})

//获得信息
const usestore = useUserStore()

// 用户操作

const goToUserPage = () => router.push('/user-index')
const logout = () => usestore.removeinfo()

// 搜索防抖请求
let timer: number | null = null
const fetchResults = (val: string) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    const res = await getarticleclassresult(val)
    filteredItems.value = res.data.msg
  }, 300)
}
watch(searchText, (val) => {
  if (val) fetchResults(val)
  else filteredItems.value = []
})

// 选择搜索项
// 跳转到详情页
function selectItem(title: string, id: number) {
  searchText.value = title // 点击选中
  isFocus.value = false // 隐藏下拉框
  router.push({
    name: 'ArticleIndex',
    params: {
      poem_id: id
    }
  })
}

// 输入框失去焦点处理
function handleBlur() {
  setTimeout(() => {
    isFocus.value = false
  }, 150) // 延迟隐藏，防止点击下拉框被立即收起
}

// 响应式汉堡菜单
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) menuOpen.value = false
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #eeeafb;
}

.el-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 25px;
  z-index: 1000;
}

.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: bold;
  font-style: italic;
  margin: 0;
}

.search-section {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
  position: relative;

  .search-input {
    width: 100%;
    :deep(.el-input__wrapper) {
      border-radius: 20px;
      border: #8a2be2 1px solid;
    }
    :deep(.is-focus) {
      outline: none;
      box-shadow: none;
    }
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 4px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    list-style: none;
    padding: 0;

    li {
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    li.empty {
      color: #999;
      cursor: default;
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;

  .menu-toggle {
    display: none;
    @media (max-width: 768px) {
      display: inline-flex;
    }
  }

  .nav-menu {
    display: flex;
    gap: 20px;
    @media (max-width: 768px) {
      display: none;
      position: absolute;
      top: 60px;
      right: 0;
      flex-direction: column;
      background-color: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      width: 180px;
    }
    &.open {
      display: flex !important;
    }
  }
}

.nav-menu .nav-item {
  font-size: 16px;
  color: #333;
  text-decoration: none;
  padding: 0 5px;
  position: relative;

  &:hover {
    color: #8a2be2;
  }

  &.router-link-active {
    color: #8a2be2;
    font-weight: bold;
    &:after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: #8a2be2;
    }
  }
}

.admin-nav {
  color: #e6a23c !important;
  &:hover {
    color: #cf9236 !important;
  }
  &.router-link-active {
    color: #e6a23c !important;
    &:after {
      background-color: #e6a23c !important;
    }
  }
}

.el-main {
  padding-top: 80px;
  background-color: #eeeafb;
  flex: 1;
  overflow-y: auto;
}

.main-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>


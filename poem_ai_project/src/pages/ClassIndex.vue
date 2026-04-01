<template>
  <div class="class-index-container">

    <!-- 分类横幅 -->
    <div class="theme-banner" v-if="themeInfo">
      <img :src="baseURL + themeInfo.theme_image" class="banner-img" :alt="themeInfo.theme_name" />
      <div class="banner-overlay">
        <h1 class="banner-title">{{ themeInfo.theme_name }}</h1>
        <p class="banner-desc">{{ themeInfo.theme_description }}</p>
      </div>
    </div>

    <!-- 经典收录 -->
    <CardItem title="经典收录">
      <div v-if="classicPoems.length === 0 && !classicLoading" class="empty-tip">
        暂无经典收录
      </div>
      <div class="classic-grid" v-loading="classicLoading">
        <div
          class="classic-card"
          v-for="poem in classicPoems"
          :key="poem.poem_id"
          @click="goToPoem(poem.poem_id)"
        >
          <div class="classic-card-inner">
            <div class="poem-author">{{ poem.author }}</div>
            <h3 class="poem-title">{{ poem.title }}</h3>
            <p class="poem-content">{{ poem.content }}</p>
          </div>
        </div>
      </div>
    </CardItem>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getarticleclass, getPoems, getpoemsall } from '@/api/articleclass'
import { baseURL } from '@/utils/request'
import type { Theme, create } from '@/types'

interface ClassicPoem {
  poem_id: number
  title: string
  content: string
  author: string
}

const route = useRoute()
const router = useRouter()

const themeInfo = ref<Theme | null>(null)
const classicPoems = ref<ClassicPoem[]>([])
const classicLoading = ref(false)

function getThemeId() {
  return Number(route.params.them_id)
}

async function fetchThemeInfo() {
  const res = await getarticleclass()
  const list: Theme[] = res.data.msg
  themeInfo.value = list.find((t) => t.theme_id === getThemeId()) ?? null
}

async function fetchClassicPoems() {
  classicLoading.value = true
  try {
    const res = await getPoems(getThemeId())
    classicPoems.value = res.data.msg ?? []
  } catch {
    classicPoems.value = []
  } finally {
    classicLoading.value = false
  }
}

function goToPoem(poem_id: number) {
  router.push({ name: 'ArticleIndex', params: { poem_id } })
}

onMounted(async () => {
  await fetchThemeInfo()
  await fetchClassicPoems()
})

watch(
  () => route.params.them_id,
  async () => {
    await fetchThemeInfo()
    await fetchClassicPoems()
  }
)
</script>

<style lang="less" scoped>
.class-index-container {
  padding-bottom: 40px;
}

/* 横幅 */
.theme-banner {
  position: relative;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 40px;

    .banner-title {
      color: #fff;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 0 10px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }

    .banner-desc {
      color: rgba(255,255,255,0.88);
      font-size: 15px;
      margin: 0;
      text-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }
  }
}

/* 经典收录网格 */
.classic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.classic-card {
  background: linear-gradient(145deg, #f8f4ff, #f0eaff);
  border: 1px solid #e0d4f7;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(138, 43, 226, 0.15);
  }

  .classic-card-inner {
    padding: 20px;

    .poem-author {
      font-size: 12px;
      color: #8a2be2;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .poem-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin: 0 0 12px;
    }

    .poem-content {
      font-size: 13px;
      color: #666;
      line-height: 1.8;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

/* 用户创作网格 */
.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.user-card {
  background: #fff;
  border: 1px solid #e8e0f0;
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(138, 43, 226, 0.12);
  }

  .user-card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .user-nickname {
      font-size: 13px;
      color: #8a2be2;
      font-weight: 500;
    }

    .user-date {
      font-size: 12px;
      color: #aaa;
    }
  }

  .user-poem-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0 0 10px;
  }

  .user-poem-content {
    font-size: 13px;
    color: #666;
    line-height: 1.8;
    margin: 0 0 14px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .user-card-footer {
    display: flex;
    gap: 16px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #999;

      .el-icon {
        color: #8a2be2;
      }
    }
  }
}

.empty-tip {
  text-align: center;
  color: #aaa;
  padding: 40px 0;
  font-size: 14px;
}

.pagination-block {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>

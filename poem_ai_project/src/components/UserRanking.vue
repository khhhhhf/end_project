<template>
  <div class="rank-container">
    <el-card class="rank-card">
      <h3 class="rank-title">🏆 <slot></slot></h3>
      <div class="rank-top3">
        <!-- 第二名 -->
        <div class="rank-top-item rank-top-2" v-if="rankList[1]">
          <div class="avatar-wrapper">
            <el-avatar :size="70" :src="baseURL + rankList[1]?.avatar_url" />
            <span class="rank-badge silver">2</span>
          </div>
          <div class="nickname">{{ rankList[1]?.nickname || '暂无' }}</div>
          <div class="intro">
            {{ rankList[1]?.user_description || '暂无描述' }}
          </div>
          <div class="count">创作 {{ rankList[1].poem_count }}首</div>
        </div>

        <!-- 第一名 -->
        <div class="rank-top-item rank-top-1" v-if="rankList[0]">
          <div class="avatar-wrapper">
            <el-avatar
              :size="90"
              :src="baseURL + rankList[0]?.avatar_url || placeholder"
            />
            <span class="rank-badge gold">1</span>
          </div>
          <div class="nickname">{{ rankList[0]?.nickname || '暂无' }}</div>
          <div class="intro">
            {{ rankList[0]?.user_description || '暂无描述' }}
          </div>
          <div class="count">创作 {{ rankList[0].poem_count }}首</div>
        </div>

        <!-- 第三名 -->
        <div class="rank-top-item rank-top-3" v-if="rankList[2]">
          <div class="avatar-wrapper">
            <el-avatar
              :size="70"
              :src="baseURL + rankList[2]?.avatar_url || placeholder"
            />
            <span class="rank-badge bronze">3</span>
          </div>
          <div class="nickname">{{ rankList[2]?.nickname || '暂无' }}</div>
          <div class="intro">
            {{ rankList[2]?.user_description || '暂无描述' }}
          </div>
          <div class="count">创作 {{ rankList[2].poem_count }}首</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { baseURL } from '@/utils/request'
import { computed } from 'vue'

interface UserRank {
  avatar_url: string
  nickname: string
  poem_count: number
  ranking: number
  user_description: string
}

// props 可选，未传默认空数组
const props = withDefaults(
  defineProps<{
    item?: UserRank[]
  }>(),
  {
    item: () => []
  }
)

const placeholder = 'https://via.placeholder.com/90'

// 安全生成前三名数组
const rankList = computed(() => [
  props.item?.[0] || null,
  props.item?.[1] || null,
  props.item?.[2] || null
])
</script>

<style scoped lang="less">
.rank-container {
  width: 80%;
  margin: 30px auto;
}

.rank-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #f9f9ff, #f1f7ff);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.rank-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.rank-top3 {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 60px;
}

.rank-top-item {
  text-align: center;
  width: 150px;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

/* 头像 hover 浮动 */
.el-avatar {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.el-avatar:hover {
  transform: translateY(-8px) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 排名徽章 */
.rank-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  transition:
    transform 0.5s ease,
    box-shadow 0.5s ease;
}

.rank-badge.gold {
  background: gold;
}
.rank-badge.silver {
  background: silver;
}
.rank-badge.bronze {
  background: #cd7f32;
}

/* 当头像 hover 时，徽章旋转+发光 */
.el-avatar:hover + .rank-badge {
  transform: rotate(360deg) scale(1.2);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
}

.nickname {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  color: #333;
}

.intro {
  font-size: 13px;
  color: #777;
  margin-top: 5px;
  min-height: 32px;
}

.count {
  color: #8a2be2;
}
</style>
